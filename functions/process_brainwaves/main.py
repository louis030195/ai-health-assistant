from typing import List
import functions_framework
import os
from supabase import create_client, Client
from sklearn.decomposition import PCA
import pandas as pd
import json
import numpy as np
from datetime import datetime
from pytz import timezone

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def compute_pca(data):
    # initialize PCA
    pca = PCA(n_components=3)

    # Extract 'data' from 'metadata' and create a pandas DataFrame
    df = pd.DataFrame(
        [
            {**row["metadata"]["data"], "timestamp": row["metadata"]["timestamp"]}
            for row in data
        ]
    )

    X = np.array([e for e in df.gamma.values])

    X = X.reshape(len(df.gamma), -1)

    # Run PCA
    transformed_data = pca.fit_transform(X)

    # Add PCA results to original DataFrame
    df_pca = pd.DataFrame(transformed_data, columns=["PC1", "PC2", "PC3"])

    return df_pca


# Updated Functions
def select_columns(data):
    # Select specific columns when transforming data to DataFrame
    formatted_data = []
    for item in data:
        flattened_item = {
            "timestamp": item["metadata"]["timestamp"],
            "alpha": item["metadata"]["data"]["alpha"],
            "beta": item["metadata"]["data"]["beta"],
            "delta": item["metadata"]["data"]["delta"],
            "gamma": item["metadata"]["data"]["gamma"],
            "theta": item["metadata"]["data"]["theta"],
        }
        formatted_data.append(flattened_item)
    df = pd.DataFrame(formatted_data)
    return df


def average_over_time(df, seconds):
    # Convert the timestamp column to datetime
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="ms")
    df["timestamp"] = (
        df["timestamp"].dt.tz_localize("UTC").dt.tz_convert("America/Los_Angeles")
    )
    df.set_index("timestamp", inplace=True)
    for column in ["alpha", "beta", "delta", "gamma", "theta"]:
        # Assume each column is a list of fixed length. Create new columns for each element
        df[[f"{column}_{i}" for i in range(len(df[column][0]))]] = pd.DataFrame(
            df[column].to_list(), index=df.index
        )
    df.drop(
        columns=["alpha", "beta", "delta", "gamma", "theta"], inplace=True
    )  # Drop the original columns
    df_resampled = df.resample(f"{seconds}S").mean()
    df_resampled = df_resampled.dropna()
    return df_resampled


@functions_framework.http
def process_brainwaves(request):
    request_json = request.get_json(silent=True)
    user_id = request_json.get("user_id", None)
    if not user_id:
        return "Error: no user_id provided", 400
    window_seconds = request_json.get("window_seconds", 30)
    day = request_json.get("day", None)
    tz = request_json.get("timezone", "America/Los_Angeles")
    if not day:
        ts = datetime.now(timezone(tz)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        ts = ts.timestamp()
    else:
        # convert to datetime object in given timezone
        ts = datetime.strptime(day, "%Y-%m-%d").replace(tzinfo=timezone(tz))
        ts = ts.timestamp()

    response = (
        supabase.table("states")
        .select("metadata")
        .is_("probability", "null")
        .eq("user_id", user_id)
        # .gte("metadata->>timestamp", ts)
        .execute()
        .data
    )
    if not response:
        return [], 200
    df = select_columns(response)
    df = average_over_time(df, window_seconds)
    df.reset_index(inplace=True)
    df["timestamp"] = df["timestamp"].apply(lambda x: x.strftime("%Y-%m-%d %H:%M:%S"))
    return json.dumps(df.to_dict(orient="records")), 200


"""
gcloud auth login
gcloud projects list
gcloud config set project mediar-394022
gcloud functions deploy process_brainwaves --runtime python311 --trigger-http --allow-unauthenticated --gen2 --set-env-vars SUPABASE_URL=$SUPABASE_URL,SUPABASE_KEY=$SUPABASE_KEY --region us-central1 --memory 8096MB --timeout 540s



URL="https://process-brainwaves-e4mtrji55a-uc.a.run.app"
URL="http://localhost:8080"
curl -X POST -H "Content-Type:application/json" -d '{"user_id":"20284713-5cd6-4199-8313-0d883f0711a1"}' $URL
curl -X POST -H "Content-Type:application/json" -d '{"user_id":"20284713-5cd6-4199-8313-0d883f0711a1", "day":"2023-07-27", "timezone":"America/Los_Angeles"}' $URL

"""
