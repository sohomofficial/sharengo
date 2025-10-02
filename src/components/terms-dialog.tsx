"use client";

import { LegalDialog } from "@/components/ui/legal-dialog";
import { ProseContent } from "@/components/ui/mdx-content";

interface TermsDialogProps {
  trigger: React.ReactNode;
}

export function TermsDialog({ trigger }: Readonly<TermsDialogProps>) {
  return (
    <LegalDialog title="Terms & Conditions" trigger={trigger}>
      <ProseContent>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing and using ShareNGo, you agree to comply with and be bound
          by these Terms of Service. If you do not agree with these terms,
          please discontinue use of the service immediately.
        </p>

        <h2>Service Description</h2>
        <p>
          ShareNGo is a temporary photo-sharing platform that allows users to
          create time-limited rooms for sharing photos. All rooms and content
          are automatically deleted after expiration.
        </p>

        <h2>User Responsibilities</h2>
        <p>
          You are responsible for all content you upload to ShareNGo and must
          ensure that:
        </p>
        <ul>
          <li>You do not upload illegal, harmful, or infringing content</li>
          <li>You respect the rights and privacy of others</li>
          <li>You do not attempt to disrupt or compromise the service</li>
          <li>You comply with all applicable laws and regulations</li>
          <li>You maintain the security of your room codes and PINs</li>
        </ul>

        <h2>Content and Privacy</h2>
        <p>
          All photos and content uploaded to ShareNGo are temporary and will be
          permanently deleted when rooms expire. We do not claim ownership of
          your content, but you grant us permission to store and display it
          within the service during the room's active period.
        </p>

        <h3>What happens to your content:</h3>
        <ul>
          <li>Photos are stored securely during the room's lifetime</li>
          <li>All content is automatically deleted when rooms expire</li>
          <li>No backups or archives are maintained after deletion</li>
          <li>You retain full ownership of your uploaded content</li>
        </ul>

        <h2>Room Access and Security</h2>
        <p>
          Room codes and PINs are your responsibility to keep secure. We are not
          liable for unauthorized access resulting from shared credentials.
        </p>

        <p>
          <strong>Security best practices:</strong>
        </p>
        <ul>
          <li>Use strong PINs when creating protected rooms</li>
          <li>Only share room access with trusted individuals</li>
          <li>
            Be aware that anyone with the room code can access public rooms
          </li>
          <li>Monitor who you share room details with</li>
        </ul>

        <h2>Service Availability</h2>
        <p>
          ShareNGo is provided "as is" without warranties. We strive for high
          availability but cannot guarantee uninterrupted service. We reserve
          the right to modify, suspend, or discontinue the service at any time.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          ShareNGo and its operators shall not be liable for any direct,
          indirect, incidental, consequential, or punitive damages arising from
          your use of the service, including but not limited to data loss,
          service interruptions, or content deletion.
        </p>

        <h2>Data Retention and Deletion</h2>
        <p>
          We automatically delete all room data, photos, and metadata when rooms
          expire.
        </p>
        <p>
          <strong>Important:</strong> We do not maintain backups of expired
          content. Users should save important photos before room expiration.
        </p>

        <h2>Modifications to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use
          of ShareNGo after changes constitutes acceptance of the updated terms.
          We will make reasonable efforts to notify users of significant
          changes.
        </p>

        <h2>Contact Information</h2>
        <p>
          For questions about these terms, please contact us through our{" "}
          <a
            href="https://github.com/sohomofficial/sharengo"
            target="_blank"
            rel="noopener noreferrer"
          >
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
