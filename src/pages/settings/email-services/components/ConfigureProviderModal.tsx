import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSetupEmailConfigMutation } from '@/redux/features/email/emailConfigApiSlice';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setupEmailConfigFrontendSchema } from '@/validations/emailServices.schema';
import { z } from 'zod';

interface EmailServiceConfig {
  provider: string;
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  sendgridConfig?: {
    apiKey: string;
    verifiedSender: string;
  };
  mailgunConfig?: {
    apiKey: string;
    domain: string;
    region: string;
  };
  settings: {
    enableEmailTracking: boolean;
    enableClickTracking: boolean;
    enableOpenTracking: boolean;
  }
  rateLimits: {
    dailyLimit: number;
    hourlyLimit: number;
  };
  isActive: boolean;
}

interface ConfigureProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  provider: string;
  currentConfig?: EmailServiceConfig | null;
}

const defaultConfig: Omit<EmailServiceConfig, 'provider'> = {
  settings: {
    enableEmailTracking: true,
    enableClickTracking: true,
    enableOpenTracking: true
  },
  rateLimits: {
    dailyLimit: 1000,
    hourlyLimit: 100
  },
  isActive: true
};

const ConfigureProviderModal: React.FC<ConfigureProviderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  provider,
  currentConfig
}) => {
  const [setupEmailConfig, { isLoading }] = useSetupEmailConfigMutation();
  const [formData, setFormData] = useState<EmailServiceConfig>({ ...defaultConfig, provider });
  const [errors, setErrors] = useState<Record<string, string>>({});
  console.log(formData);

  useEffect(() => {
    if (currentConfig) {
      setFormData({
        ...defaultConfig,
        ...currentConfig,
        settings: {
          ...defaultConfig.settings,
          ...currentConfig.settings
        },
        rateLimits: {
          ...defaultConfig.rateLimits,
          ...currentConfig.rateLimits
        }
      });
    } else {
      setFormData({ ...defaultConfig, provider });
    }
  }, [currentConfig, provider]);

  const handleConfigChange = (configKey: string, field: string, value: any) => {
    setFormData((prev: EmailServiceConfig) => ({
      ...prev,
      [configKey]: {
        ...(prev[configKey as keyof EmailServiceConfig] as any),
        [field]: value
      }
    }));
    // Clear errors for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${configKey}.${field}`];
      delete newErrors[configKey];
      return newErrors;
    });
  };

  const handleNestedConfigChange = (configKey: string, parent: string, field: string, value: any) => {
    setFormData((prev: EmailServiceConfig) => ({
      ...prev,
      [configKey]: {
        ...(prev[configKey as keyof EmailServiceConfig] as any),
        [parent]: {
          ...((prev[configKey as keyof EmailServiceConfig] as any)?.[parent] || {}),
          [field]: value
        }
      }
    }));
    // Clear errors for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${configKey}.${parent}.${field}`];
      delete newErrors[`${configKey}.${field}`];
      delete newErrors[configKey];
      
      // Special handling for SMTP auth fields
      if (configKey === 'smtpConfig' && parent === 'auth') {
        if (field === 'user') {
          delete newErrors['smtpConfig.username'];
        } else if (field === 'pass') {
          delete newErrors['smtpConfig.password'];
        }
      }
      
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare data for validation
    const dataToValidate: any = {
      provider: formData.provider,
      isActive: formData.isActive,
      settings: formData.settings,
      rateLimits: formData.rateLimits
    };

    // Add provider-specific config
    if (formData.provider === 'SMTP' && formData.smtpConfig) {
      dataToValidate.smtpConfig = {
        host: formData.smtpConfig.host || '',
        port: formData.smtpConfig.port || 0,
        username: formData.smtpConfig.auth?.user || '',
        password: formData.smtpConfig.auth?.pass || '',
        secure: formData.smtpConfig.secure || false
      };
    } else if (formData.provider === 'SENDGRID' && formData.sendgridConfig) {
      dataToValidate.sendgridConfig = {
        apiKey: formData.sendgridConfig.apiKey || '',
        verifiedSender: formData.sendgridConfig.verifiedSender || ''
      };
    } else if (formData.provider === 'MAILGUN' && formData.mailgunConfig) {
      dataToValidate.mailgunConfig = {
        apiKey: formData.mailgunConfig.apiKey || '',
        domain: formData.mailgunConfig.domain || '',
        region: (formData.mailgunConfig.region?.toUpperCase() || 'US') as 'US' | 'EU'
      };
    }

    // Validate using Zod schema
    try {
      setupEmailConfigFrontendSchema.parse(dataToValidate);
      setErrors({}); // Clear errors if validation passes
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const path = err.path.join('.');
          let message = err.message;
          
          // Provide user-friendly error messages for common validation issues
          if (err.code === 'invalid_type') {
            if (err.expected === 'number') {
              message = 'Please enter a valid number';
            } else if (err.expected === 'string') {
              message = 'This field is required';
            }
          }
          
          newErrors[path] = message;
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors');
        return;
      }
    }

    try {
      await setupEmailConfig(formData).unwrap();
      toast.success('Email provider configured successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error configuring email provider:', error);
      const errorMessage = error?.data?.message || 
        'Failed to configure email provider. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configure {provider}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {provider === 'SMTP' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host *</Label>
                  <Input
                    id="smtp-host"
                    value={formData.smtpConfig?.host || ''}
                    onChange={(e) => handleConfigChange('smtpConfig', 'host', e.target.value)}
                    placeholder="smtp.gmail.com"
                    className={`${errors['smtpConfig.host'] ? 'border-red-500 ' : ''}mt-2`}
                  />
                  {errors['smtpConfig.host'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['smtpConfig.host']}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="smtp-port">Port *</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={formData.smtpConfig?.port || ''}
                    onChange={(e) => handleConfigChange('smtpConfig', 'port', parseInt(e.target.value) || 587)}
                    placeholder="587"
                    className={`${errors['smtpConfig.port'] ? 'border-red-500 ' : ''}mt-2`}
                  />
                  {errors['smtpConfig.port'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['smtpConfig.port']}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smtp-secure"
                  checked={formData.smtpConfig?.secure || false}
                  onChange={(e) => handleConfigChange('smtpConfig', 'secure', e.target.checked)}
                  className="h-4 w-4"
                />
                <Label htmlFor="smtp-secure">Use SSL/TLS (secure)</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-username">Username *</Label>
                  <Input
                    id="smtp-username"
                    type="email"
                    value={formData.smtpConfig?.auth?.user || ''}
                    onChange={(e) => handleNestedConfigChange('smtpConfig', 'auth', 'user', e.target.value)}
                    placeholder="your-email@gmail.com"
                    className={`${errors['smtpConfig.username'] ? 'border-red-500 ' : ''}mt-2`}
                  />
                  {errors['smtpConfig.username'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['smtpConfig.username']}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="smtp-password">Password *</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={formData.smtpConfig?.auth?.pass || ''}
                    onChange={(e) => handleNestedConfigChange('smtpConfig', 'auth', 'pass', e.target.value)}
                    placeholder="Your app password"
                    className={`${errors['smtpConfig.password'] ? 'border-red-500 ' : ''}mt-2`}
                  />
                  {errors['smtpConfig.password'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['smtpConfig.password']}</p>
                  )}
                </div>
              </div>
              {errors['smtpConfig'] && (
                <p className="text-xs text-red-500 mt-1">{errors['smtpConfig']}</p>
              )}
            </div>
          )}

          {provider === 'SENDGRID' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="sendgrid-api-key">API Key *</Label>
                <Input
                  id="sendgrid-api-key"
                  type="password"
                  value={formData.sendgridConfig?.apiKey || ''}
                  onChange={(e) => handleConfigChange('sendgridConfig', 'apiKey', e.target.value)}
                  placeholder="SG.xxxxxxxxxxxxxxxx"
                  className={`${errors['sendgridConfig.apiKey'] ? 'border-red-500 ' : ''}mt-2`}
                />
                {errors['sendgridConfig.apiKey'] && (
                  <p className="text-xs text-red-500 mt-1">{errors['sendgridConfig.apiKey']}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="sendgrid-sender">Verified Sender Email *</Label>
                <Input
                  id="sendgrid-sender"
                  type="email"
                  value={formData.sendgridConfig?.verifiedSender || ''}
                  onChange={(e) => handleConfigChange('sendgridConfig', 'verifiedSender', e.target.value)}
                  placeholder="noreply@yourcompany.com"
                  className={`${errors['sendgridConfig.verifiedSender'] ? 'border-red-500 ' : ''}mt-2`}
                />
                {errors['sendgridConfig.verifiedSender'] && (
                  <p className="text-xs text-red-500 mt-1">{errors['sendgridConfig.verifiedSender']}</p>
                )}
              </div>
              {errors['sendgridConfig'] && (
                <p className="text-xs text-red-500 mt-1">{errors['sendgridConfig']}</p>
              )}
            </div>
          )}

          {provider === 'MAILGUN' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="mailgun-api-key">API Key *</Label>
                <Input
                  id="mailgun-api-key"
                  type="password"
                  value={formData.mailgunConfig?.apiKey || ''}
                  onChange={(e) => handleConfigChange('mailgunConfig', 'apiKey', e.target.value)}
                  placeholder="key-xxxxxxxxxxxxxxxx"
                  className={`${errors['mailgunConfig.apiKey'] ? 'border-red-500 ' : ''}mt-2`}
                />
                {errors['mailgunConfig.apiKey'] && (
                  <p className="text-xs text-red-500 mt-1">{errors['mailgunConfig.apiKey']}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mailgun-domain">Domain *</Label>
                  <Input
                    id="mailgun-domain"
                    value={formData.mailgunConfig?.domain || ''}
                    onChange={(e) => handleConfigChange('mailgunConfig', 'domain', e.target.value)}
                    placeholder="mg.yourcompany.com"
                    className={`${errors['mailgunConfig.domain'] ? 'border-red-500 ' : ''}mt-2`}
                  />
                  {errors['mailgunConfig.domain'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['mailgunConfig.domain']}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="mailgun-region">Region *</Label>
                  <Select 
                    value={formData.mailgunConfig?.region || 'US'}
                    onValueChange={(value) => handleConfigChange('mailgunConfig', 'region', value)}
                  >
                    <SelectTrigger className={`${errors['mailgunConfig.region'] ? 'border-red-500 ' : ''}mt-2`}>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="EU">Europe</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors['mailgunConfig.region'] && (
                    <p className="text-xs text-red-500 mt-1">{errors['mailgunConfig.region']}</p>
                  )}
                </div>
              </div>
              {errors['mailgunConfig'] && (
                <p className="text-xs text-red-500 mt-1">{errors['mailgunConfig']}</p>
              )}
            </div>
          )}

          {/* <div className="flex items-center justify-between border rounded-lg p-4">
            <div>
              <Label htmlFor="service-active">Service Status</Label>
              <p className="text-sm text-muted-foreground">Enable or disable this email service</p>
            </div>
            <input
              id="service-active"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev: EmailServiceConfig) => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4"
            />
          </div> */}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigureProviderModal;