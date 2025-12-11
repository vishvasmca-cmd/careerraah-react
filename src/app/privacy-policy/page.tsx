
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <p>Last updated: December 2025</p>

                    <h3>1. Introduction</h3>
                    <p>Welcome to CareerRaah. We respect your privacy and are committed to protecting your personal data.</p>

                    <h3>2. Data We Collect</h3>
                    <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use our career assessment tools.</p>

                    <h3>3. How We Use Your Data</h3>
                    <p>We use your data to provide, maintain, and improve our services, including generating personalized career recommendations.</p>

                    <h3>4. Contact Us</h3>
                    <p>If you have any questions about this Privacy Policy, please contact us at support@careerraah.com.</p>
                </CardContent>
            </Card>
        </div>
    );
}
