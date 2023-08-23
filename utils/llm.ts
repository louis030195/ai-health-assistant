// Constants
const MAX_RETRIES = 5;
const INITIAL_DELAY = 1000; // 1 second

// Utility to make the code wait for a specific duration
const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

// Request queue and flag to check if a request is currently in progress
const requestQueue: Array<() => Promise<any>> = [];
let isRequestInProgress = false;

const processQueue = async () => {
    if (requestQueue.length === 0 || isRequestInProgress) {
        return;
    }

    isRequestInProgress = true;
    const nextRequest = requestQueue.shift();

    if (nextRequest) {
        try {
            await nextRequest();
        } catch (error) {
            // Handle or log the error if necessary
            console.error(error);
        }
    }

    isRequestInProgress = false;
    processQueue();
};
/**
 * 
 * @param message 
 * @param retries 
 * @returns 
 * 
 * @example
    (async () => {
        try {
            const result = await llm("Your message here");
            console.log(result);
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
        }
    })();
 */
export const llm = async (message: string, retries = MAX_RETRIES): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const wrappedRequest = async () => {
            try {
                const result = await executeRequest(message);
                resolve(result);
            } catch (error: any) {
                if (error.message.includes('429')) {
                    const delay = INITIAL_DELAY * Math.pow(2, MAX_RETRIES - retries);
                    console.warn(`Rate limit hit. Retrying in ${delay}ms...`);
                    await sleep(delay);
                    requestQueue.unshift(wrappedRequest);  // Push the request back to the front of the queue
                } else {
                    reject(error);
                }
            }
        };

        requestQueue.push(wrappedRequest);
        processQueue();
    });
};

const executeRequest = async (message: string) => {
    const response = await fetch('https://api.anthropic.com/v1/complete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY!
        },
        body: JSON.stringify({
            prompt: message,
            model: 'claude-2',
            max_tokens_to_sample: 500,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error(`Anthropic API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.completion;
};

