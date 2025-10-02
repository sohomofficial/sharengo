"use client";

import { LegalDialog } from "@/components/ui/legal-dialog";
import { ProseContent } from "@/components/ui/mdx-content";

interface PrivacyDialogProps {
  trigger: React.ReactNode;
}

export function PrivacyDialog({ trigger }: PrivacyDialogProps) {
  return (
    <LegalDialog title="Privacy Policy" trigger={trigger}>
      <ProseContent>
        <h2>Information We Collect</h2>
        <p>ShareNGo collects minimal information necessary to provide the service:</p>

        <h3>Automatically Collected Data</h3>
        <ul>
          <li><strong>Photos and files</strong> you voluntarily upload to rooms</li>
          <li><strong>Room metadata</strong> including names, creation times, and expiration times</li>
          <li><strong>Temporary access cookies</strong> for room authentication</li>
          <li><strong>Basic usage analytics</strong> and error logs for service improvement</li>
        </ul>

        <h3>Data We Don't Collect</h3>
        <ul>
          <li>Personal identifying information (names, emails, phone numbers)</li>
          <li>Location data beyond what's embedded in photos you choose to upload</li>
          <li>Browsing history outside of ShareNGo</li>
          <li>Third-party account information</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use collected information solely for:</p>
        <ul>
          <li><strong>Providing the photo-sharing service</strong> functionality</li>
          <li><strong>Managing room access</strong> and security through cookies</li>
          <li><strong>Automatically deleting expired content</strong> to maintain privacy</li>
          <li><strong>Improving service performance</strong> and reliability</li>
          <li><strong>Preventing abuse</strong> and maintaining service security</li>
        </ul>

        <h2>Data Storage and Security</h2>
        <p>Your data is stored securely using industry-standard practices:</p>

        <h3>Storage Infrastructure</h3>
        <ul>
          <li><strong>Photos</strong> are stored in encrypted cloud storage (Vercel Blob)</li>
          <li><strong>Room metadata</strong> is stored in secure Redis databases</li>
          <li><strong>All data transmission</strong> uses HTTPS encryption</li>
          <li><strong>Access control</strong> through secure room codes and optional PINs</li>
        </ul>

        <h2>Automatic Data Deletion</h2>
        <p>ShareNGo is designed for temporary sharing with automatic cleanup:</p>

        <h3>What Gets Deleted</h3>
        <ul>
          <li><strong>All room data</strong> is permanently deleted when rooms expire</li>
          <li><strong>Photos</strong> are removed from both databases and file storage</li>
          <li><strong>Access cookies</strong> expire automatically with rooms</li>
          <li><strong>Metadata</strong> including room names and settings</li>
        </ul>

        <h2>Information Sharing</h2>
        <p>We do not sell, trade, or share your personal information with third parties, except:</p>
        <ul>
          <li>When required by law or legal process</li>
          <li>To protect our rights or the safety of users</li>
          <li>With service providers who help operate the platform (under strict confidentiality)</li>
        </ul>

        <h2>Cookies and Tracking</h2>
        <p>ShareNGo uses minimal cookies and tracking:</p>

        <h3>Essential Cookies</h3>
        <ul>
          <li><strong>Room access authentication</strong> cookies (temporary)</li>
          <li><strong>User preferences</strong> stored locally in browser</li>
          <li><strong>Session management</strong> for room security</li>
        </ul>

        <h3>What We Don't Use</h3>
        <ul>
          <li>Third-party tracking or advertising cookies</li>
          <li>Social media tracking pixels</li>
          <li>Analytics cookies that identify individuals</li>
          <li>Cross-site tracking mechanisms</li>
        </ul>

        <h2>Your Rights and Choices</h2>
        <p>You have control over your data:</p>
        <ul>
          <li><strong>Delete your uploaded photos</strong> at any time before room expiration</li>
          <li><strong>Choose room privacy settings</strong> including PIN protection</li>
          <li><strong>Clear browser data</strong> to remove local storage and cookies</li>
          <li><strong>Control who has access</strong> to your shared rooms</li>
        </ul>

        <h2>Children's Privacy</h2>
        <p>
          ShareNGo is not intended for users under 13 years of age. We do not knowingly 
          collect personal information from children under 13. If we discover such 
          information has been collected, we will delete it promptly.
        </p>

        <h2>International Users</h2>
        <p>
          ShareNGo may be used by individuals worldwide. By using the service, 
          you consent to the transfer and processing of your information in 
          accordance with this privacy policy.
        </p>

        <h2>Changes to Privacy Policy</h2>
        <p>
          We may update this privacy policy periodically. Significant changes will be 
          communicated through the service or our communication channels. Continued 
          use constitutes acceptance of updated policies.
        </p>

        <h2>Contact Us</h2>
        <p>
          For privacy-related questions or concerns, please contact us through our{" "}
          <a href="https://github.com/sohomofficial/sharengo" target="_blank" rel="noopener noreferrer">
            GitHub repository
          </a>{" "}
          or other available communication channels.
        </p>

        <hr />
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </ProseContent>
    </LegalDialog>
  );
}