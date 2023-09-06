'use client'
import React from 'react';

const MarkdownPolicy = () => {
  return (
    <div className="mt-20 prose prose-lg">
      <h1>Privacy Policy</h1>

      <p>
        At Mediar, we take privacy very seriously. This policy outlines how we
        collect, use, disclose, and protect your personal information.
      </p>

      <h2>What Information We Collect</h2>

      <p>We collect the following types of information about you:</p>

      <ul>
        <li>
          <strong>Account information</strong> such as your name, email address,
          and password when you register for an account.
        </li>
        <li>
          <strong>Health information</strong> such as such as EEG signals, heart, sleep,
          and physical activity. That allow us to provide you personalized insights.
        </li>
        <li>
          <strong>Usage information</strong> such as how you interact with our
          services and website. This is collected through cookies, log files,
          and tracking tools.
        </li>
      </ul>

      <h2>How We Use Information</h2>

      <p>
        We use the information we collect for the following purposes:
      </p>

      <ul>
        <li>
          Provide our services to you, which includes analyzing your health data
          to generate personalized insights.
        </li>
        <li>
          Improve and develop our products, including our AI algorithms.
        </li>
        <li>
          Personalize content and experiences for you on our platform.
        </li>
        <li>
          Communicate with you, such as through email, notifications, or ads.
        </li>
        <li>
          Conduct research to advance our understanding of mind and body health.
        </li>
        <li>
          Comply with legal obligations for data processing, security, etc.
        </li>
      </ul>

      <h2>How We Share Information</h2>

      <p>
        We may share your information with the following parties:
      </p>

      <ul>
        <li>
          Service providers under contract who help operate our business, such as
          cloud hosting and AI providers.
        </li>
        <li>
          <b>We commit not to sell your data</b>, but rather use it to your advantage. Corporate uses data to optimize their ads, we use it to optimize your life.
        </li>
      </ul>

      <h2>Your Data Rights</h2>

      <p>
        As a user, you have the right to access, correct, delete, restrict, or
        object to our use of your personal data. Please contact us if you wish
        to exercise these rights.
      </p>

      <h2>Data Security</h2>

      <p>
        We utilize encryption, access controls, data minimization, and other
        safeguards to protect your personal information. However, no data
        transmission over the internet is 100% secure, so we cannot guarantee
        security.
      </p>

      <h2>Data Retention</h2>

      <p>
        We retain your personal information for as long as you have an account
        plus a reasonable period afterward in case you reactivate services. Health data may be retained longer for research purposes after removing
        identifiers.
      </p>

      <h2>Updates to this Policy</h2>

      <p>
        We may occasionally update this policy as our services evolve. You should
        revisit this page periodically to stay aware of any changes.
      </p>

      <h2>Contact Us</h2>

      <p>
        If you have any questions about this privacy policy or use of your
        personal data, please email us at louis@mediar.ai.
      </p>

    </div>
  );
};

export default MarkdownPolicy;