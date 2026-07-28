import { PageHeader, TabItem } from '@/components/ui/PageHeader';
import { MailPlus, PencilRuler } from 'lucide-react';
import EmailTemplateManagement from './email-templates';

const EmailManagementPage = () => {
    const allTabs: TabItem[] = [
    {
      name: "Email Templates",
      icon: MailPlus,
      component: <EmailTemplateManagement />,
      key: "email-templates"
    },
  ];
  return (
    <div>
        <PageHeader
        title="Builder"
        description="Build Templates and Forms"
        icon={PencilRuler}
        tabs={allTabs}
      />
    </div>
  )
}

export default EmailManagementPage