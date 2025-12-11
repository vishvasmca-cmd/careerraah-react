
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">Terms of Service</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <p>Last updated: December 2025</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>By accessing or using CareerRaah, you agree to be bound by these Terms of Service.</p>

                    <h3>2. Use of Service</h3>
                    <p>You may use our services for your personal, non-commercial use only. You must not misuse our services.</p>

                    <h3>3. User Accounts</h3>
                    <p>You are responsible for safeguarding your account details and for any activities or actions under your account.</p>

                    <h3>4. Changes to Terms</h3>
                    <p>We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page.</p>
                </CardContent>
            </Card>
        </div>
    );
}
