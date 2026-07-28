import { Shield, Lock, Eye, Database, UserX, FileText, AlertTriangle, Mail, Globe, Users, Building } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use Tainc's platform and services.
          </p>
          <p className="text-sm text-muted-foreground">
            Effective Date: June 20, 2025
          </p>
        </div>

        {/* Introduction */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            Introduction
          </h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              At Tainc, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains in detail how we collect, use, disclose, store, and safeguard your information when you access and use our platform, mobile applications, and related services (collectively, the "Service").
            </p>
            <p>
              By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy and our Terms of Service. If you do not agree with any part of this Privacy Policy or our data handling practices, please do not use our Service. Your continued use of the Service after any modifications to this Privacy Policy will constitute your acknowledgment and acceptance of the modified terms.
            </p>
            <p>
              We encourage you to read this Privacy Policy carefully and revisit it periodically to stay informed about how we protect your information. This Privacy Policy applies to all users of our Service, including visitors, registered users, and business account holders.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Database className="h-7 w-7 text-primary" />
            Information We Collect
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Personal Information You Provide</h3>
              <p>
                We collect information that you voluntarily provide to us when you register for an account, use our Service, contact our support team, or otherwise interact with us. This information may include your full name, email address, phone number, postal address, and other contact details. When you create an account, we collect your username, password (stored in encrypted form), and security questions or two-factor authentication credentials. For business accounts, we may collect additional information including your company name, business address, tax identification number, industry type, and company size.
              </p>
              <p className="mt-4">
                When you use our payment processing features, we collect billing information such as credit card numbers (processed securely through our payment processor), billing addresses, and payment method preferences. We also collect information you provide when communicating with us, including support requests, feedback submissions, survey responses, and any other information you choose to share through our communication channels.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Automatically Collected Information</h3>
              <p>
                When you access and use our Service, we automatically collect certain technical information about your device and usage patterns. This includes your IP address, browser type and version, operating system, device identifiers (such as mobile device ID), screen resolution, and language preferences. We collect usage data showing which pages you visit, features you use, actions you take, time spent on different sections of the Service, and the dates and times of your visits.
              </p>
              <p className="mt-4">
                We use cookies, web beacons, pixel tags, and similar tracking technologies to collect information about your browsing activities and preferences. This helps us understand how you interact with our Service and enables us to provide you with a personalized experience. We also collect log data including access times, error logs, referral URLs, and search queries entered within our Service.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Information from Third Parties</h3>
              <p>
                We may receive information about you from third-party services that you choose to connect with your Tainc account, such as Google for authentication and calendar integration, payment processors like Stripe, document signing services like DocuSign, and other business tools you authorize us to access. When you use social login features or connect third-party applications, we receive profile information from those services in accordance with their privacy policies and your privacy settings on those platforms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Customer Data</h3>
              <p>
                If you use our Service to manage information about your own customers, clients, or contacts (collectively "Customer Data"), you are responsible for ensuring you have the necessary permissions and legal basis to collect and process that information through our Service. We act as a data processor for your Customer Data and process it only according to your instructions and as necessary to provide the Service to you.
              </p>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Eye className="h-7 w-7 text-primary" />
            How We Use Your Information
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              We use the information we collect for various legitimate business purposes to provide, maintain, improve, and protect our Service. Specifically, we use your information to create and manage your account, authenticate your identity when you log in, and maintain your user profile and preferences. We process transactions, send receipts and invoices, manage your subscription and billing, and handle refunds or payment disputes.
            </p>
            <p>
              Your information enables us to provide customer support, respond to your inquiries and requests, troubleshoot technical issues, and communicate with you about your account. We send you important administrative information including service announcements, updates to our Terms of Service or Privacy Policy, security alerts, and notifications about changes to your account or subscription.
            </p>
            <p>
              We analyze usage patterns and user behavior to understand how our Service is being used, identify trends and preferences, improve our features and user interface, develop new products and services, and personalize your experience. Your information helps us detect, prevent, and respond to fraud, abuse, security risks, and technical issues. We use it to enforce our Terms of Service, investigate violations, protect the rights and safety of our users, and comply with legal obligations.
            </p>
            <p>
              With your consent, we may send you marketing communications about new features, special offers, promotions, and other information that may be of interest to you. You can opt out of marketing communications at any time by following the unsubscribe instructions in those messages or by adjusting your communication preferences in your account settings.
            </p>
          </div>
        </section>

        {/* Information Sharing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <UserX className="h-7 w-7 text-primary" />
            Information Sharing and Disclosure
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We value your trust and are committed to keeping your information confidential and secure. However, we may share your information in the following limited circumstances, always with appropriate safeguards in place to protect your privacy.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Service Providers and Business Partners</h3>
              <p>
                We work with carefully selected third-party service providers who perform services on our behalf, including payment processing, data storage and hosting, customer support services, email delivery, marketing and analytics, and security services. These service providers have access to your information only to the extent necessary to perform their functions and are contractually obligated to maintain the confidentiality and security of your information. They are prohibited from using your information for any purpose other than providing services to us.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Business Transfers</h3>
              <p>
                If Tainc is involved in a merger, acquisition, asset sale, bankruptcy, reorganization, or similar business transaction, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our Service before your information is transferred and becomes subject to a different privacy policy. You will have the opportunity to delete your account and data before such a transfer if you do not wish your information to be transferred.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Legal Requirements and Protection of Rights</h3>
              <p>
                We may disclose your information when we believe in good faith that disclosure is necessary to comply with applicable laws, regulations, legal processes, or governmental requests; to enforce our Terms of Service and other agreements; to detect, prevent, or address fraud, security issues, or technical problems; to protect the rights, property, or safety of Tainc, our users, or the public as required or permitted by law; or to respond to claims that content violates the rights of third parties.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">With Your Consent</h3>
              <p>
                We may share your information with third parties when you explicitly authorize us to do so, such as when you choose to connect third-party integrations to your account or when you participate in promotional activities that involve sharing your information with sponsors or partners.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Aggregated and Anonymized Information</h3>
              <p>
                We may share aggregated, anonymized, or de-identified information that cannot reasonably be used to identify you. This information may be used for research, analytics, marketing, or any other lawful purpose. For example, we may share general industry statistics or usage trends that do not identify individual users.
              </p>
            </div>
          </div>
        </section>

        {/* Data Security */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Lock className="h-7 w-7 text-primary" />
            Data Security Measures
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              We take the security of your personal information very seriously and implement comprehensive technical, administrative, and physical security measures designed to protect your information from unauthorized access, alteration, disclosure, or destruction. Our security program is regularly reviewed and updated to address evolving threats and maintain industry best practices.
            </p>
            <p>
              All data transmitted between your device and our servers is encrypted using industry-standard TLS/SSL protocols. We encrypt sensitive data at rest using AES-256 encryption, including passwords, payment information, and other confidential data. Our databases and file storage systems employ encryption to protect your information from unauthorized access even if physical security is compromised.
            </p>
            <p>
              We implement strict access controls ensuring that only authorized personnel with a legitimate business need can access your information. All access is logged and monitored. We use multi-factor authentication for administrative access to our systems, role-based permissions to limit access based on job functions, and regular access reviews to ensure appropriate access levels.
            </p>
            <p>
              Our infrastructure is protected by firewalls, intrusion detection systems, and intrusion prevention systems that monitor network traffic for suspicious activity. We conduct regular vulnerability assessments, penetration testing by independent security experts, and security audits to identify and address potential weaknesses in our systems. All critical security patches and updates are applied promptly to keep our systems secure.
            </p>
            <p>
              Despite our comprehensive security measures, no method of transmission over the Internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your information and continuously improve our security posture, we cannot guarantee absolute security. You acknowledge that any transmission of information is at your own risk, and you are responsible for maintaining the confidentiality of your account credentials and for any activities that occur under your account.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Database className="h-7 w-7 text-primary" />
            Data Retention and Deletion
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              We retain your personal information only for as long as necessary to fulfill the purposes for which it was collected, to comply with our legal obligations, resolve disputes, enforce our agreements, and as otherwise described in this Privacy Policy. The specific retention periods depend on the nature of the information and the purposes for which it is processed.
            </p>
            <p>
              For active accounts, your account information and associated data are retained as long as your account remains active and in good standing. Your usage data and analytics may be retained for up to three years to help us improve our Service. Communication records including support tickets and email correspondence are typically retained for three years for quality assurance and legal compliance purposes.
            </p>
            <p>
              After you request account termination or deletion, we retain your data for a grace period of 30 days to allow for potential reactivation or data recovery if you change your mind. During this period, your account is marked as inactive and your data is not actively processed, but it remains available for restoration upon your request. After the 30-day grace period expires, we permanently delete your personal information from our production systems, with limited exceptions as described below.
            </p>
            <p>
              Some information may be retained for longer periods when required for legitimate business purposes or legal compliance. This includes financial records and transaction data retained for seven years to comply with tax laws and accounting regulations. Information related to legal disputes, investigations, or regulatory inquiries is retained until the matter is fully resolved and any applicable statute of limitations has expired. Backup systems may retain copies of deleted data for up to 90 days for disaster recovery purposes, after which the backups containing your data are also permanently deleted.
            </p>
            <p>
              Aggregated, anonymized, or de-identified data that can no longer be used to identify you may be retained indefinitely for analytics, research, and service improvement purposes. This data cannot be used to identify you personally and helps us understand usage patterns and improve our Service for all users.
            </p>
            <p>
              You can request permanent deletion of your data at any time by contacting our support team at <strong>support@tainc.com</strong>. We will process your deletion request in accordance with applicable data protection laws and will confirm completion of the deletion process.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Shield className="h-7 w-7 text-primary" />
            Your Privacy Rights and Choices
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              Depending on your location and applicable privacy laws, you may have certain rights regarding your personal information. We are committed to honoring these rights and providing you with control over your information. The specific rights available to you may vary based on your jurisdiction, but generally include the following.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Access</h3>
              <p>
                You have the right to request access to the personal information we hold about you. You can view and update most of your information directly through your account settings. If you need a comprehensive copy of all your data, you can request a data export, and we will provide it in a commonly used, machine-readable format within 30 days of your request.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Correction</h3>
              <p>
                You have the right to request correction of any inaccurate, incomplete, or outdated personal information we hold about you. You can update most of your information directly in your account settings. For information you cannot update yourself, please contact our support team, and we will make the necessary corrections promptly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Deletion</h3>
              <p>
                You have the right to request deletion of your personal information, subject to certain exceptions where we are required or permitted by law to retain certain information. When you request deletion, we will permanently delete your information from our active systems within 30 days, unless we have a legal obligation to retain it longer.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Data Portability</h3>
              <p>
                You have the right to receive a copy of your personal information in a structured, commonly used, and machine-readable format (such as CSV or JSON). You can export your data at any time through your account settings, or you can request a comprehensive data export from our support team.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Object and Restrict Processing</h3>
              <p>
                You have the right to object to certain types of processing of your personal information, including processing for direct marketing purposes. You can opt out of marketing communications at any time by clicking the unsubscribe link in our emails or by adjusting your communication preferences in your account settings. You also have the right to request restriction of processing in certain circumstances, such as while we verify the accuracy of your information or assess whether you have valid grounds for objection.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Withdraw Consent</h3>
              <p>
                Where we process your information based on your consent, you have the right to withdraw that consent at any time. Withdrawing consent will not affect the lawfulness of processing based on consent before its withdrawal. You can manage your consent preferences in your account settings.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Right to Lodge a Complaint</h3>
              <p>
                If you believe we have not handled your personal information in accordance with applicable privacy laws, you have the right to lodge a complaint with the relevant data protection authority in your jurisdiction. We encourage you to contact us first at <strong>support@tainc.com</strong> so we can address your concerns directly.
              </p>
            </div>

            <p className="mt-6">
              To exercise any of these rights, please contact us at <strong>support@tainc.com</strong> or through your account settings. We will respond to your request within 30 days, or as otherwise required by applicable law. We may need to verify your identity before processing your request to ensure the security of your information.
            </p>
          </div>
        </section>

        {/* Cookies */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Eye className="h-7 w-7 text-primary" />
            Cookies and Tracking Technologies
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              We use cookies, web beacons, pixel tags, local storage, and similar tracking technologies to collect information about your browsing activities, remember your preferences, and provide you with a personalized experience. Cookies are small text files that are stored on your device when you visit our Service. They help us recognize your browser and remember certain information about your visits.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Types of Cookies We Use</h3>
              <p>
                Essential cookies are necessary for our Service to function properly. These cookies enable core functionality such as user authentication, account management, security features, and basic navigation. You cannot opt out of essential cookies because the Service would not work properly without them. Session cookies are temporary and are deleted when you close your browser, while persistent cookies remain on your device until they expire or you delete them.
              </p>
              <p className="mt-4">
                Analytics and performance cookies help us understand how visitors use our Service by collecting information about which pages are visited most often, how long users spend on different pages, and what errors users encounter. We use this information to improve the performance and usability of our Service. We use services like Google Analytics to collect and analyze this data, and we have implemented privacy-focused settings to protect your information.
              </p>
              <p className="mt-4">
                Functional cookies remember your preferences and settings, such as your language preferences, theme choices, layout customizations, and previously entered form data. These cookies help provide you with a more personalized and convenient experience by remembering your choices across sessions.
              </p>
              <p className="mt-4">
                Marketing and advertising cookies track your browsing activity across websites to deliver targeted advertisements and measure the effectiveness of our marketing campaigns. These cookies may be set by us or by our advertising partners. You can opt out of these cookies through your browser settings or by using our cookie preference center.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Managing Cookie Preferences</h3>
              <p>
                Most web browsers automatically accept cookies by default, but you can modify your browser settings to decline cookies or alert you when cookies are being sent. You can delete cookies that have already been set through your browser's privacy settings. However, if you choose to disable cookies, some features of our Service may not function properly, and your user experience may be limited.
              </p>
              <p className="mt-4">
                For more information about managing cookies in specific browsers, please visit the browser's help section: Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, or your browser's support documentation. You can also visit <strong>www.allaboutcookies.org</strong> for comprehensive information about cookies and how to manage them.
              </p>
            </div>
          </div>
        </section>

        {/* International Transfers */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Globe className="h-7 w-7 text-primary" />
            International Data Transfers
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              Tainc operates globally, and your information may be transferred to, stored in, and processed in countries other than your country of residence, including the United States and other countries where our servers, service providers, or business partners are located. These countries may have data protection laws that differ from those in your country.
            </p>
            <p>
              When we transfer personal information from the European Economic Area (EEA), United Kingdom, or Switzerland to countries that have not been deemed to provide an adequate level of data protection by the European Commission or relevant authorities, we implement appropriate safeguards to protect your information. These safeguards include Standard Contractual Clauses approved by the European Commission, binding corporate rules, Privacy Shield certification (where applicable), or other legally recognized mechanisms.
            </p>
            <p>
              By using our Service, you acknowledge and consent to the transfer and processing of your information in accordance with this Privacy Policy. We ensure that any international transfers comply with applicable data protection laws and that your information receives an adequate level of protection wherever it is processed.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 text-primary" />
            Children's Privacy
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              Our Service is not intended for, nor directed to, children under the age of 18. We do not knowingly collect, use, or disclose personal information from children under 18. If you are under 18 years of age, please do not use our Service or provide any personal information to us.
            </p>
            <p>
              If we become aware that we have inadvertently collected personal information from a child under 18 without proper parental consent, we will take immediate steps to delete that information from our systems. If you are a parent or guardian and believe that your child has provided us with personal information without your consent, please contact us immediately at <strong>support@tainc.com</strong>, and we will promptly investigate and remove the information.
            </p>
          </div>
        </section>

        {/* GDPR Compliance */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            GDPR Compliance for European Users
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, the General Data Protection Regulation (GDPR) and equivalent laws provide you with specific rights regarding your personal data. This section explains how we comply with GDPR requirements and the additional protections available to you.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Legal Basis for Processing</h3>
              <p>
                We process your personal data only when we have a legal basis to do so. The legal bases we rely on include your consent when you have explicitly agreed to processing for specific purposes, performance of a contract when processing is necessary to provide the Service you requested, compliance with legal obligations when we must process your data to comply with laws or regulations, and legitimate interests when processing is necessary for our legitimate business interests and does not override your fundamental rights and freedoms.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Controller and Processor Roles</h3>
              <p>
                For your account information, billing data, and usage analytics, Tainc acts as the Data Controller, determining the purposes and means of processing. For Customer Data that you store in our Service about your own customers or clients, you act as the Data Controller and Tainc acts as the Data Processor, processing data only on your behalf and according to your instructions. A Data Processing Agreement (DPA) is available upon request and governs our processing obligations as a Data Processor.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Data Protection Impact Assessments</h3>
              <p>
                We conduct Data Protection Impact Assessments (DPIAs) for any processing activities that may result in high risks to your rights and freedoms. We implement appropriate measures to mitigate identified risks and ensure compliance with GDPR requirements.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Exercising Your GDPR Rights</h3>
              <p>
                You can exercise your GDPR rights by contacting us at <strong>support@tainc.com</strong>. We will respond to your request within one month, or two months for complex requests. We do not charge a fee for processing most requests, but we may charge a reasonable fee for excessive, repetitive, or manifestly unfounded requests.
              </p>
            </div>
          </div>
        </section>

        {/* California Privacy Rights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Building className="h-7 w-7 text-primary" />
            California Privacy Rights (CCPA)
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              If you are a California resident, the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA) provide you with specific rights regarding your personal information. This section describes your California privacy rights and how to exercise them.
            </p>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Your California Rights</h3>
              <p>
                California residents have the right to know what personal information we collect, use, disclose, and sell about them, including the categories of personal information, the sources from which it was collected, the business purposes for collection, and the categories of third parties with whom we share it. You have the right to request deletion of your personal information, subject to certain exceptions. You have the right to opt out of the sale or sharing of your personal information for targeted advertising (note: we do not sell your personal information). You have the right to correct inaccurate personal information. You have the right to limit the use and disclosure of sensitive personal information.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">How to Exercise Your California Rights</h3>
              <p>
                To exercise your California privacy rights, you can submit a request by emailing <strong>support@tainc.com</strong>, calling our toll-free number, or using the "Data Rights Request" form in your account settings. We will verify your identity before processing your request, which may require you to provide additional information. You may designate an authorized agent to submit requests on your behalf by providing written authorization.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Non-Discrimination</h3>
              <p>
                We will not discriminate against you for exercising your California privacy rights. We will not deny you goods or services, charge you different prices or rates, provide you with a different level of quality, or suggest that you may receive a different price or quality of goods or services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Shine the Light</h3>
              <p>
                California Civil Code Section 1798.83 permits California residents to request certain information regarding our disclosure of personal information to third parties for their direct marketing purposes. We do not share your personal information with third parties for their direct marketing purposes.
              </p>
            </div>
          </div>
        </section>

        {/* Data Breach Notification */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <AlertTriangle className="h-7 w-7 text-primary" />
            Data Breach Notification
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              In the unlikely event of a data breach that affects the security of your personal information, we have comprehensive incident response procedures in place to detect, investigate, and respond to security incidents promptly. We will notify affected users and relevant authorities without undue delay and in accordance with applicable data breach notification laws.
            </p>
            <p>
              For incidents covered by GDPR, we will notify the relevant supervisory authority within 72 hours of becoming aware of the breach, unless the breach is unlikely to result in a risk to your rights and freedoms. We will notify affected users without undue delay when the breach is likely to result in a high risk to their rights and freedoms.
            </p>
            <p>
              Our breach notification will include a description of the nature of the breach, including the categories and approximate number of affected data subjects and records; the name and contact information of our Data Protection Officer or other contact point where more information can be obtained; a description of the likely consequences of the breach; and a description of the measures we have taken or propose to take to address the breach and mitigate its potential adverse effects.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FileText className="h-7 w-7 text-primary" />
            Changes to This Privacy Policy
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make changes, we will update the "Effective Date" at the top of this Privacy Policy and post the updated version on our website.
            </p>
            <p>
              For material changes that significantly affect your privacy rights or how we use your information, we will provide more prominent notice by sending you an email notification to the email address associated with your account, displaying a prominent notice within our Service, or by other means as appropriate. We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and protect your information.
            </p>
            <p>
              Your continued use of the Service after the effective date of any changes constitutes your acceptance of the updated Privacy Policy. If you do not agree with any changes, you may close your account and stop using our Service before the changes take effect.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Mail className="h-7 w-7 text-primary" />
            Contact Us
          </h2>
          <div className="space-y-6 text-foreground/80 leading-relaxed">
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data handling practices, we encourage you to contact us. We are committed to addressing your inquiries promptly and transparently.
            </p>
            <div className="bg-muted/50 p-6 rounded-lg mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Privacy Contact Information</h3>
              <div className="space-y-2 text-foreground/80">
                <p><strong>Email:</strong> support@tainc.com</p>
                
                <p><strong>Support Portal:</strong> Visit our Contact page for additional support options</p>
                <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 5 business days</p>
              </div>
            </div>
            <p className="mt-6">
              For general support inquiries, bug reports, or feature requests, please use our standard support channels. For privacy-specific matters, data rights requests, or GDPR/CCPA inquiries, please use the privacy contact information above to ensure your request is routed to the appropriate team.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
