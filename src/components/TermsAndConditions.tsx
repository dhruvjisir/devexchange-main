import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const TermsAndConditions = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 h-auto font-normal">
          Terms and Conditions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms and Conditions for Listing on Startup Bazaar</DialogTitle>
          <DialogDescription>
            Please read these terms and conditions carefully before listing your project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <p>Effective Date: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h3 className="font-semibold">1. Eligibility</h3>
            <p>You may use Startup Bazaar only if:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are at least 18 years old and legally authorized to represent your business or product.</li>
              <li>You have full ownership or legal rights to list and offer the content.</li>
              <li>You comply with all applicable laws and regulations.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold">2. Listing Requirements</h3>
            <p>When creating a listing, you agree to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide accurate, up-to-date, and complete information about your product or service.</li>
              <li>Specify pricing, licensing (if applicable), and key terms clearly.</li>
              <li>Disclose whether your listing includes open-source or proprietary elements.</li>
              <li>Remove or update your listing if the product is no longer available.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold">3. Intellectual Property</h3>
            <p>You retain full ownership of your listed content.</p>
            <p>By submitting a listing, you grant Startup Bazaar a non-exclusive, worldwide, royalty-free license to display, market, and promote your content on our platform and affiliated channels.</p>
          </section>

          <section>
            <h3 className="font-semibold">4. Fees and Payments</h3>
            <p>Startup Bazaar may charge fees for listings, promotions, or successful transactions. These fees will be clearly communicated before submission.</p>
          </section>

          <section>
            <h3 className="font-semibold">5. Review and Moderation</h3>
            <p>We reserve the right to review, moderate, and remove listings that violate our policies, contain inappropriate content, or pose any risk to the community.</p>
          </section>

          <section>
            <h3 className="font-semibold">6. Prohibited Conduct</h3>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>List stolen, illegal, or fraudulent content.</li>
              <li>Engage in spam, deceptive practices, or malicious behavior.</li>
              <li>Attempt to access another user's account or Startup Bazaar's internal systems.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold">7. No Guarantees</h3>
            <p>Startup Bazaar does not guarantee sales, visibility, funding, or business outcomes.</p>
          </section>

          <section>
            <h3 className="font-semibold">8. Limitation of Liability</h3>
            <p>To the maximum extent allowed by law, Startup Bazaar shall not be liable for any indirect, incidental, or consequential damages related to your use of the Platform or any listings.</p>
          </section>

          <section>
            <h3 className="font-semibold">9. Termination</h3>
            <p>We reserve the right to suspend or terminate your access to the Platform at any time for violations or misconduct.</p>
          </section>

          <section>
            <h3 className="font-semibold">10. Changes to Terms</h3>
            <p>These Terms may be updated from time to time. Continued use of the Platform constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h3 className="font-semibold">Zero-Tolerance Policy</h3>
            <p>Startup Bazaar maintains a zero-tolerance policy toward fraud, forgery, and misrepresentation.</p>
            <p>By listing on the Platform, you agree that all documents, information, certifications, and representations you provide are true, accurate, and legally valid.</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 