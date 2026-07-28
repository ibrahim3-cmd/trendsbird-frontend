import { ScrollText, Shield, AlertCircle, FileText, Scale, UserCheck, Building2, CreditCard, Lock, Server, Mail, Briefcase, Database } from "lucide-react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-8 py-16">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16 pb-8 border-b-2 border-primary/20">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Please read these terms and conditions carefully before using our comprehensive business management platform.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last Updated: December 30, 2025
          </p>
        </div>

        {/* Introduction */}
        <section className="prose prose-slate max-w-none mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            Introduction and Acceptance of Terms
          </h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              Welcome to <strong>Tainc</strong>, a comprehensive business management and Customer Relationship Management (CRM) platform 
              designed specifically for field service businesses, contractors, and service-oriented organizations. These Terms and Conditions 
              ("Terms", "Agreement") constitute a legally binding agreement between you (the "User", "Customer", "Client", or "you") and 
              Tainc ("we", "us", "our", or the "Company") governing your access to and use of our platform, services, mobile applications, 
              website, software, APIs, and all related features and functionality (collectively, the "Service" or "Platform").
            </p>
            <p>
              By creating an account, accessing the Platform, or using any part of our Service in any manner, you acknowledge that you 
              have read, understood, and agree to be bound by these Terms, along with our Privacy Policy, Data Processing Agreement, 
              and any other policies referenced herein. If you are entering into this Agreement on behalf of a company, organization, 
              or other legal entity, you represent and warrant that you have the authority to bind such entity to these Terms, and 
              references to "you" shall refer to such entity.
            </p>
            <p className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r">
              <strong className="text-destructive">IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE THE SERVICE.</strong> We reserve the right to 
              modify, update, or change these Terms at any time at our sole discretion. We will provide notice of material changes 
              through the Platform, via email, or by other reasonable means. Your continued use of the Service after such modifications 
              constitutes your acceptance of the updated Terms. It is your responsibility to review these Terms periodically.
            </p>
            <p className="text-sm text-muted-foreground italic">
              This Agreement was last updated on December 30, 2025, and supersedes all previous versions.
            </p>
          </div>
        </section>

        {/* Service Description */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-primary" />
            Description of Services
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              Tainc provides a cloud-based, subscription software-as-a-service (SaaS) platform that offers comprehensive 
              business management tools specifically designed for field service businesses, contractors, and service professionals. 
              Our Service encompasses a wide range of integrated features designed to streamline your business operations and enhance productivity.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 my-8 bg-muted/30 p-6 rounded-lg border border-border">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Core CRM Features</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Lead and opportunity management with customizable pipelines</li>
                  <li>Contact and client database management</li>
                  <li>Sales pipeline tracking and stage automation</li>
                  <li>Lead source tracking and conversion analytics</li>
                  <li>Custom forms and public form submissions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Job & Project Management</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Job creation, scheduling, and tracking</li>
                  <li>Task assignment and progress monitoring</li>
                  <li>Service and package catalog management</li>
                  <li>Real-time job status updates</li>
                  <li>Job cost estimation and tracking</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Financial Management</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Invoice generation and management</li>
                  <li>Payment processing via Stripe integration</li>
                  <li>Prepayment, deposit, and final billing</li>
                  <li>Payment tracking and reconciliation</li>
                  <li>Financial reporting and analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Client Portal</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Self-service client dashboard</li>
                  <li>Job status visibility and tracking</li>
                  <li>Online payment processing</li>
                  <li>Document signing and approvals</li>
                  <li>Appointment scheduling and rescheduling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Marketing & Automation</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Email campaign creation and management</li>
                  <li>Automated workflow builder</li>
                  <li>Trigger-based automation actions</li>
                  <li>Email template designer</li>
                  <li>Marketing analytics and reporting</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Calendar & Scheduling</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Integrated calendar management</li>
                  <li>Appointment booking and scheduling</li>
                  <li>Public booking pages</li>
                  <li>Google Calendar synchronization</li>
                  <li>Team availability management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Document Management</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Digital document signing (DocuSign integration)</li>
                  <li>Proposal and estimate generation</li>
                  <li>Document storage and organization</li>
                  <li>File attachment and sharing</li>
                  <li>Document approval workflows</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Inventory & Resources</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Inventory tracking and management</li>
                  <li>Consumable item monitoring</li>
                  <li>Product and vendor management</li>
                  <li>Requisition workflows</li>
                  <li>Stock level alerts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Analytics & Reporting</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Real-time business dashboards</li>
                  <li>Job analytics and performance metrics</li>
                  <li>Revenue and payment tracking</li>
                  <li>Conversion rate analysis</li>
                  <li>Custom report generation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Team & Organization</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Multi-user role-based access control</li>
                  <li>Organization and sub-organization management</li>
                  <li>User permission management</li>
                  <li>Team collaboration tools</li>
                  <li>Activity logs and audit trails</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Integrations</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Third-party application integrations</li>
                  <li>API access for custom integrations</li>
                  <li>Google OAuth and calendar sync</li>
                  <li>Payment gateway integrations</li>
                  <li>Email service provider connections</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Communication Tools</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Real-time messaging and notifications</li>
                  <li>Email communication tracking</li>
                  <li>SMS messaging capabilities</li>
                  <li>Internal notes and comments</li>
                  <li>Client communication history</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm italic">
              <strong>Note:</strong> Feature availability may vary depending on your subscription plan. We reserve the right to 
              modify, enhance, or discontinue features with reasonable notice to users. New features may be added to the Service 
              without prior notice and shall be subject to these Terms.
            </p>
          </div>
        </section>

        {/* Account Terms */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <UserCheck className="h-7 w-7 text-primary" />
            Account Registration and Eligibility
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Eligibility Requirements</h3>
              <p>
                To use our Service, you must meet the following requirements: You must be at least 18 years of age, or the age of majority in your jurisdiction, whichever is greater, and must have the legal capacity to enter into a binding contract. If you are registering on behalf of a company or organization, you must be authorized to bind that entity to these Terms. You must not be prohibited from receiving our services under any applicable laws, and you acknowledge that our Service may not be available in all countries or jurisdictions due to geographic or regulatory restrictions.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Account Registration</h3>
              <p>
                When creating an account, you agree to provide accurate, current, and complete information during registration, and to maintain and promptly update your account information to keep it accurate and complete. You must use your real name and valid contact information (business or personal), and you must not impersonate any person or entity or misrepresent your affiliation with any individual or organization. You agree to create only one account per individual or organization unless explicitly authorized by us, and you may not share your account with others or allow others to access your account using your credentials. You must verify your email address and complete any required verification steps as part of the registration process.
              </p>
              <p className="mt-4 text-sm">
                We reserve the right to reject any registration or terminate any account that violates these requirements or for any other reason at our sole discretion.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Account Security and Credentials</h3>
              <p>
                You are responsible for maintaining the security of your account. You must choose a strong, unique password and keep it confidential. We strongly recommend that you enable two-factor authentication when available to add an additional layer of security to your account. You must not share your password or authentication credentials with anyone. You must notify us immediately at <strong>[security@tainc.com]</strong> if you suspect any unauthorized access to your account. You should log out from your account after each session, especially when using shared or public devices, and review your account activity regularly to identify and report any suspicious behavior.
              </p>
              <p className="mt-4">
                <strong>You are solely responsible for all activities that occur under your account,</strong> whether or not authorized by you. We are not liable for any loss or damage arising from your failure to maintain account security, and you agree to indemnify us for any losses resulting from unauthorized use of your account due to your negligence.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Organization Accounts and Team Management</h3>
              <p>
                For organization accounts, the account creator becomes the primary administrator ("Admin") with full control over the account and all associated data. Admins can invite team members and assign roles with specific permissions tailored to each user's responsibilities. Admins are responsible for managing user access and ensuring that all team members comply with these Terms and use the Service appropriately. Each team member must have their own individual login credentials and must not share accounts. Organizations must ensure that all users under their account comply with these Terms and all applicable laws. Account ownership and billing responsibility remain with the registered organization, and Admins must promptly remove access for any departing team members to maintain security.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Account Verification</h3>
              <p>
                We may require additional verification of your identity, business information, or payment details before activating certain features or providing access to specific functionality. This verification process may include providing business registration documents, tax identification numbers, proof of address, or other documentation that establishes your identity and legitimacy. Failure to provide requested verification within a reasonable timeframe may result in limited functionality or temporary account suspension until verification is completed.
              </p>
            </div>
          </div>
        </section>

        {/* Subscription and Billing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <CreditCard className="h-7 w-7 text-primary" />
            Subscription Plans, Billing, and Payment Terms
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Subscription Plans</h3>
              <p>
                Tainc offers various subscription plans with different features, user limits, and pricing structures. Our plans may include a Free Trial period (if available) providing limited-time access to evaluate the platform, a Starter Plan offering basic features suitable for small businesses, a Professional Plan with advanced features designed for growing businesses, an Enterprise Plan providing comprehensive features with premium support and dedicated resources, and Custom Plans offering tailored solutions for businesses with specific needs. Feature availability, user limitations, storage quotas, and pricing for each plan are detailed on our pricing page and may be updated from time to time with reasonable notice. You acknowledge that plan features may change as we continue to develop and improve the Service, and we will provide reasonable notice of material changes affecting your subscription.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Billing Cycle and Fees</h3>
              <p>
                Subscription fees are billed in advance on a recurring basis, with billing cycles occurring monthly, annually, or as otherwise specified in your chosen plan. Your subscription will automatically renew at the end of each billing cycle unless you cancel before the renewal date. We may change our fees with at least 30 days' advance notice provided via email or platform notification. All fees are exclusive of applicable taxes, duties, levies, or similar governmental charges, which you are responsible for paying in addition to the subscription fees. Fees are charged in USD or the currency specified during your subscription signup. Some features may incur additional usage-based charges, such as fees for SMS messages sent through the platform, email volume exceeding plan limits, or additional storage requirements beyond your plan's allocation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Payment Methods and Processing</h3>
              <p>
                You must provide valid payment information, including a credit card, debit card, or other authorized payment method accepted by our platform. Payment processing is handled securely through our third-party payment processor, Stripe, which maintains PCI-DSS compliance. By providing your payment information, you authorize us to charge your designated payment method for all fees associated with your account, including subscription fees, usage-based charges, and any applicable taxes. You must maintain current, complete, and accurate billing and payment information at all times, updating your information promptly if your payment method expires or changes. Payment information is subject to validation and approval by your payment provider, and we may verify payment information before processing charges. We reserve the right to charge different payment methods on file if your primary payment method fails. Failed payments may result in service interruption, reduced functionality, or account suspension until payment is successfully processed.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Free Trials and Promotions</h3>
              <p>
                If you register for a free trial, the trial duration and available features are determined at our sole discretion and may vary based on the specific promotion or offer. You may be required to provide payment information to start a trial, and your account will automatically convert to a paid subscription at the end of the trial period unless you cancel before the trial expires. We reserve the right to limit free trial eligibility, typically to one trial per customer or organization, to prevent abuse of the trial program. Trial accounts are subject to usage limits and may have certain features restricted or disabled. We may terminate free trials at any time without notice if we detect abuse, fraudulent activity, or violations of these Terms.
              </p>
              <p className="mt-4">
                Promotional pricing, discounts, or special offers are valid for the specified period only and may not be combined with other promotions unless explicitly stated. Promotional terms and availability are subject to change without prior notice.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r">
              <h3 className="text-xl font-semibold text-foreground mb-3">Refund Policy</h3>
              <p>
                <strong>Important:</strong> All fees paid are generally non-refundable, with the following limited exceptions: If you cancel within 14 days of your initial purchase (not applicable to renewals), you may request a full refund of the fees paid. Refunds will not be provided for partial billing periods or unused time remaining in your subscription. For annual subscriptions, refunds may be prorated based on unused months, provided that at least 3 months remain in your subscription period. No refunds will be issued for account termination due to violations of these Terms or our policies. Refund requests must be submitted in writing via email to [billing@tainc.com] and include your account details and reason for the refund request. Approved refunds are typically processed within 10-15 business days and returned to the original payment method used for the purchase.
              </p>
              <p className="mt-4 text-sm">
                This refund policy does not affect any statutory rights you may have under applicable consumer protection laws in your jurisdiction.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Late Payments and Account Suspension</h3>
              <p>
                If payment fails or becomes overdue, we will make reasonable attempts to collect payment using the payment method on file in our system. You will receive email notifications about failed payment attempts to give you the opportunity to update your payment information. Your account may be suspended after 7 days of non-payment, during which time access to certain features may be restricted. We may assess late fees of $25 or 1.5% per month (whichever amount is greater) on overdue amounts, as permitted by law. During a suspension period, access to your data may be restricted, though your data will not be immediately deleted. Your account may be permanently terminated if payment is not received within 30 days of the initial failed payment, at which point data deletion procedures will begin. You remain liable for all outstanding fees plus any reasonable collection costs incurred by us in attempting to collect the overdue payment.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Downgrades and Cancellation</h3>
              <p>
                You may downgrade your subscription plan or cancel your subscription at any time through your account settings or by contacting our support team. Downgrades to a lower-tier plan take effect at the start of your next billing cycle, and you will continue to have access to your current plan's features until that time. Cancellations are effective at the end of your current paid billing period, allowing you to continue using the Service until your subscription expires. No refunds or credits will be issued for partial billing periods when downgrading or canceling. Access to your data after cancellation is subject to our Data Retention Policy as described elsewhere in these Terms. You may export your data at any time before cancellation, and we recommend doing so to ensure you have a backup. Reactivation of a canceled account may require payment of all outstanding fees and may be subject to then-current pricing.
              </p>
            </div>
          </div>
        </section>

        {/* Service Usage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <ScrollText className="h-7 w-7 text-primary" />
            Acceptable Use Policy
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              You agree to use the Service in compliance with all applicable laws, regulations, and these Terms. 
              <strong> You expressly agree NOT to engage in the following prohibited activities:</strong>
            </p>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Prohibited Activities</h3>
              <p className="mb-4">
                You must not use the Service for any illegal activities or in violation of any local, state, national, or international laws. You must not engage in fraudulent activities, including payment fraud, identity theft, or deceptive practices. You must not harass, abuse, threaten, or intimidate other users, our staff, or any third parties. You must not send spam, unsolicited emails, SMS messages, or other communications to contacts without proper consent and compliance with anti-spam laws.
              </p>
              <p className="mb-4">
                You must not upload, transmit, or distribute viruses, malware, trojans, ransomware, or other malicious code that could harm the Service or other users. You must not attempt to gain unauthorized access to the Service, other user accounts, servers, or networks connected to the Service. You must not circumvent, disable, or interfere with security features, access controls, or authentication mechanisms. You must not reverse engineer, decompile, disassemble, or attempt to derive source code from the Service or any portion thereof.
              </p>
              <p className="mb-4">
                You must not interfere with or disrupt the Service, servers, or networks connected to the Service, or violate any requirements, procedures, policies, or regulations of such networks. You must not use automated means such as bots, scrapers, crawlers, or similar tools to access, collect, or extract data from the Service without explicit authorization. You must not abuse system resources or use the Service in a manner that negatively impacts performance for other users through excessive API calls, data processing, or bandwidth consumption.
              </p>
              <p>
                You must not impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or organization. You must not infringe upon copyrights, trademarks, patents, trade secrets, or other intellectual property rights of any third party. You must not upload, store, or transmit illegal, harmful, threatening, abusive, defamatory, obscene, or otherwise objectionable content. You must not use the Service to develop, operate, or market a competing product or service. You must not resell, sublicense, rent, or lease access to the Service without our written authorization. You must not provide false, misleading, or inaccurate information when using the Service. You must not collect, store, or share personal data of others without proper consent or legal basis. You must not use payment features for money laundering, terrorist financing, or other illegal financial activities.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Email and Communication Compliance</h3>
              <p>
                When using our email and marketing features, you must comply with all applicable anti-spam laws, including but not limited to the CAN-SPAM Act (United States), GDPR (European Union), CASL (Canada), and other international anti-spam regulations. You must obtain proper consent before sending marketing communications to contacts. You must include accurate sender information in all emails and provide functioning unsubscribe mechanisms that are easy to locate and use. You must honor unsubscribe requests promptly, removing recipients from your mailing lists within 10 business days as required by law. You must not send misleading subject lines or deceptive content designed to trick recipients into opening emails. You must maintain accurate contact lists and promptly remove bounced or invalid email addresses. You must not purchase or use third-party email lists unless you can demonstrate proper consent from all recipients.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Usage and Privacy Obligations</h3>
              <p>
                You agree to comply with all applicable data protection and privacy laws, including GDPR, CCPA, and other regional privacy regulations relevant to your operations and customer base. You must obtain all necessary consents for collecting and processing personal data through the Service. You must maintain appropriate privacy policies and notices for your customers that accurately describe how their data is collected, used, and protected. You must use customer data only for legitimate business purposes and in accordance with applicable law. You must implement appropriate technical and organizational security measures to protect data from unauthorized access, loss, or disclosure. You must promptly respond to data subject requests for access, correction, deletion, or portability of their personal information in accordance with applicable law. You must notify us immediately of any data breaches involving data stored in or processed through our Service, so that we can assist with appropriate response measures.
              </p>
            </div>
            <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r">
              <h3 className="text-xl font-semibold text-foreground mb-3">Enforcement and Consequences</h3>
              <p>
                Violation of this Acceptable Use Policy may result in serious consequences, including immediate suspension or termination of your account without prior notice, removal of content that violates these policies, loss of access to your data, legal action and reporting to law enforcement authorities as appropriate, liability for damages and legal fees incurred as a result of your violations, and a permanent ban from creating future accounts on our platform. We reserve the right to investigate suspected violations of this policy and to cooperate fully with law enforcement authorities in their investigations. You agree to cooperate with our investigations and to provide any requested information or documentation in a timely manner.
              </p>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Shield className="h-7 w-7 text-primary" />
            Intellectual Property Rights
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Our Intellectual Property</h3>
              <p>
                The Service, including all content, features, functionality, software, code, designs, graphics, user interfaces, 
                visual interfaces, photographs, trademarks, logos, brand elements, and documentation (collectively, "Tainc IP") 
                is owned by Tainc, its licensors, or other content providers and is protected by international copyright laws and treaties, trademark laws and regulations, patent rights (where applicable), trade secret protections, and other intellectual property and proprietary rights laws. These Terms do not grant you any ownership rights to the Tainc IP. All rights, title, and interest in and to the Service and Tainc IP remain exclusively with Tainc and its licensors.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Limited License to Use the Service</h3>
              <p>
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Service for your internal business purposes, to use the Service in accordance with the features and limitations of your subscription plan, and to access documentation and training materials provided through the Service. This license automatically terminates upon violation of these Terms or termination of your account.
              </p>
              <p className="mt-4">
                You may not copy, modify, adapt, translate, or create derivative works based on the Service. You may not distribute, license, sublicense, sell, rent, lease, or transfer the Service to any third party. You may not remove, alter, or obscure any copyright, trademark, or other proprietary notices from the Service. You may not frame or mirror any portion of the Service on any other website or platform. You may not use the Service to build a similar or competitive product or service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Content and Data</h3>
              <p>
                "Your Content" means any data, information, files, documents, contacts, images, videos, or other materials that you or your authorized users upload, submit, post, transmit, or store through the Service. <strong>You retain all ownership rights to Your Content.</strong> However, by using the Service, you grant us a worldwide, non-exclusive, royalty-free, transferable license to use, store, copy, modify, display, perform, and distribute Your Content solely for the purpose of providing, maintaining, improving, and supporting the Service. You also grant us the right to process Your Content through automated systems for technical operations such as backup, indexing, and search functionality, and the right to create aggregated, anonymized, statistical data derived from Your Content for analytics and service improvement purposes, provided such data cannot be used to identify you or your customers.
              </p>
              <p className="mt-4">
                This license continues for a commercially reasonable period after you delete Your Content or terminate your account to allow for backup retention, disaster recovery, and legal compliance. We will not share Your Content with third parties except as necessary to provide the Service, comply with legal obligations, or with your explicit consent.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Responsibilities for Your Content</h3>
              <p>
                You represent and warrant that you own or have obtained all necessary rights, licenses, consents, and permissions to use and share Your Content through the Service. You represent that Your Content does not infringe any intellectual property rights, privacy rights, publicity rights, or other rights of any third party. You warrant that Your Content does not violate any applicable laws or regulations, including but not limited to laws regarding data protection, export control, obscenity, defamation, or harassment. You confirm that Your Content does not contain illegal, harmful, defamatory, libelous, or obscene material. You represent that you have obtained all necessary consents for processing personal data included in Your Content in accordance with applicable privacy laws.
              </p>
              <p className="mt-4">
                You are solely responsible for Your Content and the consequences of uploading, publishing, or sharing it through the Service. We do not endorse or guarantee the accuracy, integrity, quality, or appropriateness of Your Content.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Copyright Infringement and DMCA</h3>
              <p>
                We respect intellectual property rights and expect our users to do the same. If you believe that content on our Service infringes your copyright, please notify us in writing with the following information: identification of the copyrighted work claimed to be infringed (or a representative list if multiple works), identification of the material claimed to be infringing with sufficient detail to allow us to locate it (including URL or specific location within the Service), your contact information including name, address, telephone number, and email address, a statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law, a statement that the information in your notification is accurate and that you are authorized to act on behalf of the copyright owner, and your physical or electronic signature.
              </p>
              <p className="mt-4 text-sm">
                Send copyright infringement notices to: <strong>[legal@tainc.com]</strong> or our designated DMCA agent. We may terminate accounts of repeat infringers in appropriate circumstances.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Trademarks</h3>
              <p>
                "Tainc" and associated logos, product names, and service names are trademarks of Tainc and may not be used without our prior written permission. You may not use these trademarks in any manner that could cause confusion about the source of products or services, or in any manner that disparages or discredits Tainc. All other trademarks, service marks, and trade names referenced in the Service are the property of their respective owners.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Feedback and Suggestions</h3>
              <p>
                If you provide feedback, suggestions, ideas, or recommendations regarding the Service or our business ("Feedback"), you grant us a perpetual, irrevocable, worldwide, royalty-free, fully sublicensable license to use, modify, reproduce, distribute, and incorporate such Feedback into our products and services without any compensation, attribution, or obligation to you. We are free to use any ideas, concepts, know-how, or techniques contained in your Feedback for any purpose whatsoever.
              </p>
            </div>
          </div>
        </section>

        {/* Data and Privacy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Database className="h-7 w-7 text-primary" />
            Data Protection, Privacy, and Security
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Privacy Policy</h3>
              <p>
                Our collection, use, and protection of your personal information is governed by our <a href="/privacy-policy" className="text-primary hover:underline font-semibold">Privacy Policy</a>, 
                which is incorporated into these Terms by reference. By using the Service, you consent to our privacy practices as 
                described in the Privacy Policy. Please review the Privacy Policy carefully to understand how we handle your personal information.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Processing and GDPR Compliance</h3>
              <p>
                For users subject to the General Data Protection Regulation (GDPR) or similar data protection laws, the following provisions apply: For account and billing data, we act as a Data Controller with primary responsibility for how that data is used. For customer data you store in the Service, you act as the Data Controller and we act as a Data Processor, processing data on your behalf according to your instructions. A Data Processing Agreement (DPA) is available upon request and governs our processing of personal data on your behalf, establishing our respective obligations and liabilities. We will assist you in responding to data subject access requests, erasure requests, portability requests, and other rights under GDPR. We implement appropriate technical and organizational security measures to protect personal data as required by law. Data may be transferred to and processed in countries outside the European Economic Area, with appropriate safeguards in place such as Standard Contractual Clauses. We maintain a list of subprocessors who may access data in the course of providing the Service, available upon request.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Security Measures</h3>
              <p>
                We implement industry-standard security measures to protect your data, including encryption of data in transit using TLS/SSL protocols and encryption of data at rest using AES-256 encryption. We conduct regular security audits and penetration testing to identify and address vulnerabilities. We maintain access controls and role-based permissions to ensure that only authorized personnel can access data. We offer multi-factor authentication options for enhanced account security. We operate automated backup systems with geographic redundancy to protect against data loss. We employ intrusion detection and prevention systems to monitor for and respond to security threats. All employees with access to data undergo security training and background checks. We maintain incident response procedures and breach notification protocols to respond quickly to security incidents.
              </p>
              <p className="mt-4 text-sm">
                However, no system is completely secure. You acknowledge that any transmission of data over the internet is at your own risk, 
                and we cannot guarantee absolute security against all possible threats.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Retention and Deletion</h3>
              <p>
                For active accounts, your data is retained as long as your account remains active and in good standing. After account termination, data is retained for 30 days to allow for potential reactivation or data recovery. After 30 days post-termination, most data is permanently deleted from our production systems, with some exceptions for data we are required to retain for legal compliance, tax, or regulatory purposes. Backup systems may retain data for up to 90 days for disaster recovery purposes, after which backups containing your data are also deleted. Data subject to legal obligations, ongoing disputes, or investigations may be retained for longer periods as required by law or legal process. Anonymized, aggregated data that cannot be used to identify you or your customers may be retained indefinitely for analytics and service improvement purposes.
              </p>
              <p className="mt-4">
                You can request data export or permanent deletion at any time by contacting <strong>[support@tainc.com]</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Breach Notification</h3>
              <p>
                In the event of a data breach affecting your personal data or customer data stored in the Service, we will notify you without undue delay and within the timeframes required by applicable law, which includes notification within 72 hours for incidents covered by GDPR. Our notification will include the nature of the breach, the categories and approximate number of affected data subjects and records, the potential consequences of the breach, and the measures we have taken or propose to take to address the breach and mitigate its potential adverse effects.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Third-Party Services and Integrations</h3>
              <p>
                Our Service integrates with various third-party services, including Stripe for payment processing, Google for authentication and calendar integration, and DocuSign for document signing. Your use of these integrations is subject to the third party's own terms of service and privacy policies, our Sub-Processor Agreement which governs data processing by these third parties, and your explicit authorization to connect these services to your account. We are not responsible for the privacy practices, security measures, or content of third-party services. We recommend that you review their policies carefully before connecting any integrations.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Export and Portability</h3>
              <p>
                You have the right to export your data at any time in common, machine-readable formats including CSV, JSON, and PDF. Data export features are available through your account settings dashboard or by contacting our support team for assistance. We will respond to data export requests within 30 days of receipt and provide the data in a format that allows you to easily transfer it to another service provider.
              </p>
            </div>
          </div>
        </section>

        {/* Service Availability and Support */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Server className="h-7 w-7 text-primary" />
            Service Availability, Uptime, and Support
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Service Availability</h3>
              <p>
                We strive to provide continuous availability of the Service, but we do not guarantee uninterrupted access at all times. We target 99.5% uptime for the Service, excluding periods of scheduled maintenance. We may perform scheduled maintenance with advance notice, typically during off-peak hours to minimize disruption. Emergency maintenance may occur without prior notice when necessary to address critical issues or security vulnerabilities. The Service may be temporarily unavailable due to circumstances beyond our reasonable control, including internet service provider outages, force majeure events, or failures of third-party service providers. Service Level Agreements apply only to paid accounts at specified plan levels and not to free or trial accounts.\n              </p>\n            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Customer Support</h3>
              <p>
                Support availability and response times vary depending on your subscription plan. Free and Trial accounts have access to community support forums and self-service documentation only. The Starter Plan includes email support during business hours with a target response time of 48 hours. The Professional Plan provides email and chat support with a 24-hour response time. The Enterprise Plan offers priority support via email, chat, and phone with a 4-hour response time, plus access to a dedicated account manager.
              </p>
              <p className="mt-4 text-sm">
                Business hours are Monday through Friday, 9:00 AM to 6:00 PM Eastern Standard Time, excluding federal holidays. Support response times are targets and not guarantees, representing our best efforts to respond within the stated timeframes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Service Modifications</h3>
              <p>
                We reserve the right to modify, enhance, suspend, or discontinue any part of the Service at any time, with or without notice, at our sole discretion. We will provide reasonable advance notice for material changes that adversely affect your use of core features, typically through email notifications or in-platform announcements. We are not liable for any modification, suspension, or discontinuation of the Service or any part thereof.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Beta Features and New Releases</h3>
              <p>
                From time to time, we may offer beta, preview, or experimental features for testing and feedback purposes. Beta features are provided "as is" without warranties of any kind and may be changed or discontinued without notice. Data entered into beta features may not be preserved if the feature is discontinued or significantly modified. Beta features may have bugs, limited functionality, or performance issues. Use of beta features is entirely at your own risk, and we recommend not using them for production or mission-critical data until they are released as stable features.
              </p>
            </div>
          </div>
        </section>

        {/* Warranties and Disclaimers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertCircle className="h-7 w-7 text-primary" />
            Warranties, Disclaimers, and Representations
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Warranties</h3>
              <p>You represent and warrant that you have the legal authority to enter into this Agreement, your use of the Service complies with all applicable laws and regulations, all information you provide is accurate, current, and complete, you own or have obtained all necessary rights to Your Content, Your Content does not violate any third-party rights or applicable laws, and you will not use the Service for any prohibited purposes as outlined in these Terms.</p>
            </div>
            <div className="bg-destructive/5 border-l-4 border-destructive p-6 rounded-r">
              <h3 className="text-xl font-semibold text-foreground mb-3">Disclaimer of Warranties</h3>
              <p className="uppercase font-semibold text-foreground mb-4">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
              </p>
              <p>
                <strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.</strong> We do not warrant merchantability or that the Service is suitable for your particular purposes. We do not warrant fitness for a particular purpose or that the Service will meet your specific requirements. We do not warrant non-infringement of third-party rights. We do not warrant the accuracy, completeness, or reliability of any content or data. We do not warrant uninterrupted, timely, secure, or error-free operation or availability of the Service. We do not warrant any specific results from use of the Service. We do not warrant that the Service is completely secure or free from viruses, malware, or harmful components. We do not endorse or warrant third-party integrations, content, or services accessible through our platform.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">No Professional Advice</h3>
              <p>
                The Service is not intended to provide legal, financial, accounting, tax, medical, or other professional advice. 
                You should consult appropriate professionals for specific advice related to your situation. We are not responsible 
                for decisions made based on information or tools provided through the Service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Third-Party Services and Integrations</h3>
              <p>
                The Service may integrate with or contain links to third-party services, websites, applications, or content. 
                We do not control, endorse, or assume responsibility for third-party services. Your interactions with third parties 
                are solely between you and the third party. We are not liable for any damages arising from third-party services.
              </p>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertCircle className="h-7 w-7 text-primary" />
            Limitation of Liability and Indemnification
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-foreground mb-3">Limitation of Liability</h3>
              <p className="uppercase font-semibold text-foreground mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
              </p>
              <p className="mb-4">
                <strong>IN NO EVENT SHALL TAINC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, LICENSORS, OR SERVICE 
                PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.</strong> This includes but is not limited to loss of profits, revenue, business opportunities, or anticipated savings; loss of data, files, or customer information; loss of goodwill or reputation; business interruption or downtime; cost of procurement of substitute goods or services; or any other intangible losses.
              </p>
              <p>
                <strong>This limitation applies whether based on warranty, contract, tort (including negligence), strict liability, or any other legal theory, 
                even if we have been advised of the possibility of such damages.</strong>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Cap on Liability</h3>
              <p>
                <strong>OUR TOTAL AGGREGATE LIABILITY</strong> to you for all claims arising from or related to the Service, these Terms, 
                or your use of the Service, <strong>SHALL NOT EXCEED THE GREATER OF:</strong> (a) The total amount paid by you to us in the 12 months immediately preceding the event giving rise to liability, or (b) $100 USD. This limitation applies regardless of the number of claims or causes of action and regardless of legal theory.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Exceptions to Limitations</h3>
              <p>
                Some jurisdictions do not allow the exclusion or limitation of certain warranties or damages. In such jurisdictions, 
                our liability will be limited to the maximum extent permitted by law. The limitations in this section do not apply to death or personal injury caused by our gross negligence or willful misconduct, fraud or fraudulent misrepresentation, or liabilities that cannot be excluded or limited under applicable law.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your Indemnification Obligations</h3>
              <p>
                <strong>You agree to indemnify, defend, and hold harmless Tainc, its affiliates, and their respective officers, 
                directors, employees, agents, licensors, and service providers from and against any and all claims, liabilities, 
                damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from or related to:</strong> your use or misuse of the Service, your violation of these Terms or any applicable laws, Your Content or any data you submit to the Service, your violation of any rights of another person or entity (including intellectual property rights), your breach of any representations or warranties made in these Terms, any activities conducted through your account whether by you or others using your credentials, or your negligence, willful misconduct, or illegal activities.
              </p>
              <p className="mt-4">
                We reserve the right to assume exclusive defense and control of any matter subject to indemnification, at your expense. 
                You will cooperate fully with us in asserting any available defenses.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Basis of the Bargain</h3>
              <p>
                The disclaimers, exclusions, and limitations of liability set forth in these Terms are fundamental elements of the 
                basis of the bargain between you and Tainc. You acknowledge that we would not be able to provide the Service on an 
                economically reasonable basis without these limitations.
              </p>
            </div>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertCircle className="h-7 w-7 text-primary" />
            Account Termination and Suspension
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Termination by You</h3>
              <p>You may terminate your account at any time by accessing your account settings and selecting the cancellation option, contacting our support team at <strong>[support@tainc.com]</strong>, or following the cancellation instructions in your account dashboard.</p>
              <p className="mt-4">
                Termination takes effect at the end of your current billing period. You will retain access to the Service until 
                that time. No refunds will be provided for the remaining portion of your subscription period unless required by 
                applicable law. You remain responsible for all charges incurred prior to termination.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Termination or Suspension by Us</h3>
              <p>
                We may suspend or terminate your account and access to the Service, immediately and without prior notice or liability, 
                for any reason including: breach of any provision of these Terms or our policies, failure to pay fees when due after the grace period, suspected fraud, abuse, or illegal activity, legal requirements including court orders or government authority demands, your account posing a security or operational risk, prolonged inactivity after notice and reasonable opportunity to respond, excessive resource usage or system abuse, storage or distribution of illegal, harmful, or infringing content, multiple violations despite warnings, or excessive payment chargebacks or disputes.
              </p>
              <p className="mt-4">
                We will provide notice and opportunity to cure when reasonably possible, except in cases requiring immediate action 
                (fraud, security threats, legal requirements).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Effects of Termination</h3>
              <p>Upon termination of your account, your right to access and use the Service immediately ceases and you lose access to Your Content and data stored in the Service. We retain your data for 30 days as described in our Data Retention Policy for potential reactivation. You should export your data before termination; we may provide assistance within 30 days of termination though fees may apply. You remain liable for all unpaid fees and charges. All licenses granted to you under these Terms terminate immediately, and connected third-party services may be disconnected.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Account Reactivation</h3>
              <p>
                Within 30 days of termination, you may request account reactivation by contacting support and paying any outstanding 
                fees. After 30 days, your data may be permanently deleted, and reactivation may not be possible. Accounts terminated 
                for Terms violations may not be eligible for reactivation.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Survival of Terms</h3>
              <p>
                The following provisions survive termination of these Terms and continue to apply: Intellectual Property Rights (licenses we granted to you terminate, but our rights survive), your indemnification obligations, limitations of liability and disclaimers, payment obligations for services rendered before termination, dispute resolution and governing law provisions, and any other provisions that by their nature should survive.
              </p>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Scale className="h-7 w-7 text-primary" />
            Dispute Resolution and Arbitration
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Informal Resolution</h3>
              <p>
                Before initiating formal dispute resolution procedures, you agree to first attempt to resolve any dispute informally 
                by contacting us at <strong>[legal@tainc.com]</strong> with a detailed description of the dispute. We will attempt 
                to resolve the dispute informally within 60 days. If we cannot resolve the dispute informally, either party may proceed 
                to formal dispute resolution.
              </p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r">
              <h3 className="text-xl font-semibold text-foreground mb-3">Binding Arbitration</h3>
              <p className="mb-4">
                <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT.</strong>
              </p>
              <p className="mb-4">
                Except for disputes that qualify for small claims court or disputes seeking injunctive relief, <strong>all disputes 
                arising from or relating to these Terms or the Service shall be resolved through binding arbitration</strong> rather than 
                in court. Arbitration is more informal than a lawsuit and uses a neutral arbitrator instead of a judge or jury.
              </p>
              <p>
                Arbitration shall be conducted by the American Arbitration Association (AAA) under its Commercial Arbitration Rules and, if applicable, the Supplementary Procedures for Consumer-Related Disputes. The arbitrator has exclusive authority to resolve disputes concerning the interpretation, applicability, or enforceability of this arbitration agreement. Arbitration will be conducted in [Your Jurisdiction] or remotely via video conference. Each party bears its own attorneys' fees unless the arbitrator awards otherwise, and we will pay AAA arbitration fees for claims under $10,000. The arbitrator's award is binding and may be entered as a judgment in any court of competent jurisdiction.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Class Action Waiver</h3>
              <p className="uppercase font-semibold text-foreground mb-4">
                YOU AND TAINC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A 
                PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.
              </p>
              <p>
                Unless both you and we agree otherwise, the arbitrator may not consolidate more than one person's claims and may not 
                preside over any form of class, consolidated, or representative proceeding. If this class action waiver is found to be 
                unenforceable, the entire arbitration agreement shall be unenforceable.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Exceptions to Arbitration</h3>
              <p>Either party may seek relief in court for claims eligible for small claims court (provided they remain in small claims court), requests for injunctive or equitable relief to protect intellectual property rights, or claims of piracy, unauthorized use, or copyright infringement.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Opt-Out Right</h3>
              <p>
                You have the right to opt out of this arbitration agreement by sending written notice within 30 days of first accepting 
                these Terms to: <strong>[legal@tainc.com]</strong> with the subject "Arbitration Opt-Out" and your account information. 
                If you opt out, all other terms of this Agreement still apply, but neither party can require the other to arbitrate disputes.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Time Limitation on Claims</h3>
              <p>
                <strong>You must bring any claim against us within one (1) year after the claim arises,</strong> or the claim is permanently 
                barred. This one-year period begins when you first knew or should have known about the facts giving rise to the claim.
              </p>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Scale className="h-7 w-7 text-primary" />
            Governing Law and Jurisdiction
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Governing Law</h3>
              <p>
                These Terms and any disputes arising from or relating to these Terms or the Service shall be governed by and construed 
                in accordance with the laws of <strong>[State/Province]</strong> and the applicable federal laws of 
                <strong> [Country]</strong>, without regard to its conflict of law principles.
              </p>
              <p className="mt-4">
                For international users: The United Nations Convention on Contracts for the International Sale of Goods does not apply 
                to these Terms.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Jurisdiction and Venue</h3>
              <p>
                To the extent not subject to arbitration, you agree that any legal action or proceeding arising from or relating to 
                these Terms or the Service shall be brought exclusively in the state or federal courts located in <strong>[City, State]</strong>, 
                and you consent to the personal jurisdiction and venue of such courts.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">International Use and Export Controls</h3>
              <p>
                The Service is controlled and operated from <strong>[Country]</strong>. We make no representation that the Service is 
                appropriate or available for use in all locations. Access to the Service from jurisdictions where its content is illegal 
                is prohibited. You agree to comply with all applicable export and re-export control laws and regulations, including the Export Administration 
                Regulations maintained by the U.S. Department of Commerce and sanctions programs administered by the U.S. Treasury Department's 
                Office of Foreign Assets Control.
              </p>
            </div>
          </div>
        </section>

        {/* General Provisions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            General Provisions and Miscellaneous
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy, Data Processing Agreement, and any other policies or agreements 
                referenced herein, constitute the entire agreement between you and Tainc concerning the Service and supersede all 
                prior agreements, understandings, and communications, whether written or oral, regarding the subject matter herein.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Amendments and Modifications</h3>
              <p>
                We reserve the right to modify these Terms at any time. When we make material changes, we will notify you by posting the updated Terms with a new "Last Updated" date, sending an email notification to your registered email address, or displaying a prominent notice in the Service.
              </p>
              <p className="mt-4">
                Your continued use of the Service after the effective date of updated Terms constitutes your acceptance of the changes. 
                If you do not agree to the updated Terms, you must stop using the Service and may terminate your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Waiver and Severability</h3>
              <p>
                Our failure to enforce any right or provision of these Terms shall not be deemed a waiver of such right or provision. 
                Any waiver must be in writing and signed by an authorized representative of Tainc.
              </p>
              <p className="mt-2">
                If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, 
                the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum 
                extent necessary to make it valid and enforceable while reflecting the original intent.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Assignment</h3>
              <p>
                You may not assign, transfer, or delegate your rights or obligations under these Terms without our prior written consent. 
                Any attempted assignment in violation of this provision is void. We may assign or transfer our rights and obligations under 
                these Terms without restriction, including in connection with a merger, acquisition, reorganization, or sale of assets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Force Majeure</h3>
              <p>
                We shall not be liable for any failure or delay in performing our obligations under these Terms due to circumstances beyond 
                our reasonable control, including acts of God, natural disasters, war, terrorism, riots, embargoes, acts of civil or military 
                authorities, fire, floods, accidents, pandemics, strikes, or shortages of transportation, facilities, fuel, energy, labor, or 
                materials. Our obligations will be suspended during the period of force majeure and extended for a reasonable time thereafter.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Relationship of Parties</h3>
              <p>
                Nothing in these Terms creates any partnership, joint venture, agency, franchise, sales representative, or employment 
                relationship between you and Tainc. You have no authority to make or accept any offers or representations on our behalf. 
                Neither party shall be considered an agent of the other for any purpose.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">No Third-Party Beneficiaries</h3>
              <p>
                These Terms are for the benefit of you and Tainc only and are not intended to confer any rights upon any third party, 
                except as expressly provided herein (e.g., indemnification provisions).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Language and Translation</h3>
              <p>
                These Terms are originally written in English. Any translations provided are for convenience only. In the event of any 
                conflict or inconsistency between the English version and any translation, the English version shall prevail.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Notices</h3>
              <p>
                All notices, requests, demands, and other communications under these Terms shall be in writing and shall be deemed to have 
                been duly given: to you when sent to the email address associated with your account or displayed in the Service; to us when sent to <strong>[legal@tainc.com]</strong> or to our registered business address.
              </p>
              <p className="mt-4 text-sm">
                Our registered business address: <strong>[Tainc, Inc., Address, City, State, ZIP]</strong>
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Electronic Communications</h3>
              <p>
                By using the Service, you consent to receive electronic communications from us, including emails, notifications, and 
                messages posted to your account. You agree that all agreements, notices, disclosures, and other communications that we 
                provide electronically satisfy any legal requirement that such communications be in writing.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Accessibility</h3>
              <p>
                We strive to make our Service accessible to users with disabilities. If you experience accessibility issues, please 
                contact us at <strong>[accessibility@tainc.com]</strong> so we can work to address them.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Feedback and Improvement</h3>
              <p>
                We welcome your feedback about the Service. You may submit feedback through the Service or by contacting support. 
                By submitting feedback, you grant us the right to use it without compensation or obligation to you.
              </p>
            </div>
          </div>
        </section>

        {/* California and US-Specific Provisions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Shield className="h-7 w-7 text-primary" />
            California and U.S. Consumer Rights
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">California Users</h3>
              <p>
                If you are a California resident, you have specific rights under California law. Under the CCPA, you have the right to know what personal information we collect, use, and disclose about you, and the right to request deletion of your personal information (subject to exceptions). We do not sell your personal information, and you have the right to opt out of any future sale of personal information. We will not discriminate against you for exercising your CCPA rights. Under the Shine the Light Law, once per year, you may request information about our disclosure of certain categories of personal information to third parties for direct marketing purposes.
              </p>
              <p className="mt-4 text-sm">
                To exercise your California privacy rights, contact us at <strong>[support@tainc.com]</strong>.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">U.S. State Consumer Protection Laws</h3>
              <p>
                If you reside in Virginia, Colorado, Connecticut, Utah, or other states with comprehensive privacy laws, you may have 
                additional rights regarding your personal data, including rights to access, correct, delete, and port your data, and to 
                opt out of certain processing activities. Please refer to our Privacy Policy or contact us for more information.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Children's Privacy</h3>
              <p>
                The Service is not intended for children under the age of 18 (or 13 in some jurisdictions). We do not knowingly collect 
                personal information from children. If you are a parent or guardian and believe your child has provided us with personal 
                information, please contact us immediately at <strong>[support@tainc.com]</strong>, and we will take steps to delete 
                such information.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Mail className="h-7 w-7 text-primary" />
            Contact Information and Support
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              If you have any questions, concerns, or feedback about these Terms and Conditions or the Service, please contact us 
              through the following channels:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  General Inquiries
                </h4>
                <p className="text-sm">Email: <strong>support@tainc.com</strong></p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Legal & Compliance
                </h4>
                <p className="text-sm">Email: <strong>legal@tainc.com</strong></p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Privacy & Data Protection
                </h4>
                <p className="text-sm">Email: <strong>support@tainc.com</strong></p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Billing & Payments
                </h4>
                <p className="text-sm">Email: <strong>billing@tainc.com</strong></p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Security Concerns
                </h4>
                <p className="text-sm">Email: <strong>security@tainc.com</strong></p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Mailing Address
                </h4>
                <p className="text-sm">
                  <strong>Tainc, Inc.</strong><br />
                  [Street Address]<br />
                  [City, State ZIP]<br />
                  [Country]
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>Customer Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM EST (excluding holidays)
                <br />
                <strong>Emergency Support:</strong> Available for Enterprise plan customers 24/7
              </p>
            </div>
            <p className="mt-4 text-sm">
              For additional resources, documentation, and frequently asked questions, please visit our 
              <strong> Help Center</strong> or <strong>Contact Page</strong> accessible through the Service.
            </p>
            <p className="mt-4 text-sm italic">
              We aim to respond to all inquiries within 2-5 business days, depending on the nature and complexity of your request. 
              For urgent matters, please indicate "URGENT" in your subject line.
            </p>
          </div>
        </section>

        {/* Acknowledgment */}
        <div className="border-2 border-primary/20 bg-primary/5 p-8 rounded-lg mb-16">
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Acknowledgment and Acceptance</h3>
            <p className="text-foreground leading-relaxed">
              <strong>BY CREATING AN ACCOUNT, ACCESSING, OR USING THE TAINC SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, 
              UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS AND CONDITIONS, INCLUDING OUR PRIVACY POLICY.</strong>
            </p>
            <p className="text-sm text-foreground/80">
              If you do not agree to these Terms, you must immediately discontinue use of the Service. Your continued use of 
              the Service constitutes your ongoing agreement to these Terms as they may be updated from time to time.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Document Version: 1.0 | Effective Date: December 30, 2025 | Last Updated: December 30, 2025
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground mt-8 pb-8">
          <p>
            © {new Date().getFullYear()} Tainc, Inc. All rights reserved.
          </p>
          <p className="mt-2">
            This document is provided for informational purposes and does not constitute legal advice. 
            For specific legal guidance, please consult with a qualified attorney.
          </p>
        </div>
      </div>
    </div>
  );
}
