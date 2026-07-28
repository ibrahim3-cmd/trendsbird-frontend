import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  useGetContactsQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} from "@/redux/features/contact/contactApiSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/modals/DeleteWarningModal";
import { Plus, Search, Pencil, Trash2, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { IContact, IContactCreate } from "@/types/contact.type";
import { ApiError } from "@/types/api.type.error";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import OrgSelect from "@/components/ui/OrgSelect";
import { z } from "zod";
import { TagsInput } from "@/components/ui/tags-input";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

const Contacts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<IContact | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    contact: IContact | null;
  }>({
    open: false,
    contact: null,
  });

  // Get user info to check if super admin
  const { data: userInfo } = useUserInfoQuery(undefined);
  const orgId = userInfo?.data?.org?._id;
  const isSuperAdmin = userInfo?.data?.role === 'SUPER_ADMIN';

  // Form state
  const [formData, setFormData] = useState<IContactCreate & { org?: string }>({
    name: "",
    email: "",
    phone: "",
    profileUrl: "",
    contactType: "",
    timeZone: "",
    org: "",
    tags: [],
    channels: {
      dndAllChannels: false,
      email: false,
      extMessage: false,
      callAndVoice: false,
      inboundCallsAndSms: false,
    },
  });

  // Validation errors state
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    org?: string;
    name?: string;
    profileUrl?: string;
  }>({});

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: contactData, isLoading } = useGetContactsQuery({
    page: currentPage,
    limit: pageLimit,
    searchTerm: debouncedSearch,
  });

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  const contacts = contactData?.data || [];
  const meta = contactData?.meta || {
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  };

  // Extract unique tags from existing contacts
  const distinctTags = contacts.reduce((tags: string[], contact) => {
    if (contact.tags) {
      contact.tags.forEach(tag => {
        if (!tags.includes(tag.toLowerCase())) {
          tags.push(tag.toLowerCase());
        }
      });
    }
    return tags;
  }, []);

  const handleOpenSheet = (contact?: IContact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name || "",
        email: contact.email || "",
        phone: contact.phone || "",
        profileUrl: contact.profileUrl || "",
        contactType: contact.contactType || "",
        timeZone: contact.timeZone || "",
        org: contact.org || "",
        tags: contact.tags?.length ? contact.tags.map((tag: string) => tag.toLowerCase()) : [],
        channels: contact.channels || {
          dndAllChannels: false,
          email: false,
          extMessage: false,
          callAndVoice: false,
          inboundCallsAndSms: false,
        },
      });
    } else {
      setEditingContact(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        profileUrl: "",
        contactType: "",
        timeZone: "",
        org: isSuperAdmin ? "" : orgId || "",
        tags: [],
        channels: {
          dndAllChannels: false,
          email: false,
          extMessage: false,
          callAndVoice: false,
          inboundCallsAndSms: false,
        },
      });
      setErrors({});
    }
    setSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setSheetOpen(false);
    setEditingContact(null);
    setErrors({});
  };

  // Zod schemas for validation
  const emailSchema = z.string().email({ message: "Invalid email address" });

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    // Check if name is provided
    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    // Check if either email or phone is provided
    if (!formData.email?.trim() && !formData.phone?.trim()) {
      newErrors.email = "Email is required";
      newErrors.phone = "Phone is required";
    }

    // Validate email format if provided
    if (formData.email?.trim()) {
      try {
        emailSchema.parse(formData.email.trim());
      } catch (err) {
        if (err instanceof z.ZodError) {
          newErrors.email = err.issues[0].message;
        }
      }
    }



    // Validate profile URL if provided
    if (formData.profileUrl?.trim()) {
      try {
        z.string().url().parse(formData.profileUrl.trim());
      } catch (err) {
        if (err instanceof z.ZodError) {
          newErrors.profileUrl = "Invalid URL format";
        }
      }
    }
     
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }
    // Clear errors if validation passes
    setErrors({});

    try {
      // Handle single tag case - if there are no tags but there's input text, add it
      const currentTags = formData.tags || [];
      let tagsToSubmit = currentTags;

      if (currentTags.length === 0) {
        // Try to get the current input value from the TagsInput
        const tagsInput = document.querySelector('input[placeholder="Type to add tags..."]') as HTMLInputElement | null;
        const inputValue = tagsInput?.value?.trim();
        if (inputValue) {
          tagsToSubmit = [inputValue.toLowerCase()];
        }
      }

      const payload: IContactCreate & { org?: string; _id?: string } = {
          ...(formData.name?.trim() && { name: formData.name }),
        ...(formData.email?.trim() && { email: formData.email }),
        ...(formData.phone?.trim() && { phone: formData.phone }),
        ...(formData.profileUrl?.trim() && { profileUrl: formData.profileUrl }),
        ...(formData.timeZone?.trim() && { timeZone: formData.timeZone }),
        ...(formData.contactType?.trim() && { contactType: formData.contactType }),
        ...(tagsToSubmit && tagsToSubmit.length > 0 && { tags: tagsToSubmit }),
        channels: formData.channels,
      };

    // Add org field only for super admin in create mode
    if (isSuperAdmin && !editingContact) {
      payload.org = formData.org;
    }

      if (editingContact) {
        await updateContact({
          ...payload,
          _id: editingContact._id,
        }).unwrap();

        toast.success("Contact updated successfully");
      } else {
        await createContact(payload).unwrap();
        toast.success("Contact created successfully");
      }

      handleCloseSheet();
    } catch (error) {
      console.error("Error saving contact:", error);
      const errorMessage =
        (error as ApiError)?.data?.message || "Failed to save contact";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.contact?._id) return;

    try {
      await deleteContact(deleteModal.contact._id).unwrap();
      toast.success("Contact deleted successfully");
      setDeleteModal({ open: false, contact: null });
    } catch (error) {
      console.error("Error deleting contact:", error);
      const errorMessage = (error as ApiError)?.data?.message || "Failed to delete contact";
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">

      <PageHeader
        icon={Users}
        title="Contacts"
        description="Manage your contacts and their communication preferences"
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button onClick={() => handleOpenSheet()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? "No contacts found matching your search" : "No contacts yet"}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact._id}>
                      <TableCell className="font-medium">
                        {contact?.name}
                      </TableCell>
                      <TableCell>{contact.email || "N/A"}</TableCell>
                      <TableCell>{contact.phone || "N/A"}</TableCell>
                      <TableCell>{formatDate(contact.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenSheet(contact)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setDeleteModal({ open: true, contact })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>

                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {meta.totalPage > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((p) => Math.min(meta.totalPage, p + 1))
                          }
                          className={
                            currentPage === meta.totalPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Contact Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingContact ? "Edit Contact" : "Add Contact"}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 p-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  // Clear error when user starts typing
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                placeholder="email@example.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                type="tel"
                value={formatPhoneNumber(formData.phone || "") }
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value});
                  // Clear error when user starts typing
                  if (errors.phone) {
                    setErrors({ ...errors, phone: undefined });
                  }
                }}
                placeholder="(234) 567-890"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Organization Select - Only for Super Admin in Create Mode */}
            {isSuperAdmin && !editingContact && (
              <div className="space-y-2">
                <OrgSelect
                  value={formData.org}
                  onValueChange={(orgId) => {
                    setFormData({ ...formData, org: orgId });
                    // Clear error when user selects an org
                    if (errors.org) {
                      setErrors({ ...errors, org: undefined });
                    }
                  }}
                  label="Organization"
                  required={true}
                  placeholder="Select organization..."
                  error={!!errors.org}
                  errorMessage={errors.org}
                />
              </div>
            )}

            {/* Profile URL */}
            <div className="space-y-2">
              <Label htmlFor="profileUrl">Profile URL</Label>
              <Input
                id="profileUrl"
                type="url"
                value={formData.profileUrl}
                onChange={(e) =>
                  setFormData({ ...formData, profileUrl: e.target.value })
                }
                placeholder="https://example.com/profile"
                className={errors.profileUrl ? "border-red-500" : ""}
              />
              {errors.profileUrl && (
                <p className="text-sm text-red-500">{errors.profileUrl}</p>
              )}
            </div>

            {/* Contact Type */}
            <div className="space-y-2">
              <Label htmlFor="contactType">Contact Type</Label>
              <Select
                value={formData.contactType}
                onValueChange={(value) =>
                  setFormData({ ...formData, contactType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Zone */}
            <div className="space-y-2">
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(value) =>
                  setFormData({ ...formData, timeZone: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>North America</SelectLabel>
                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                    <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                    <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                    <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Europe & Africa</SelectLabel>
                    <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                    <SelectItem value="cet">Central European Time (CET)</SelectItem>
                    <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                    <SelectItem value="west">
                      Western European Summer Time (WEST)
                    </SelectItem>
                    <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                    <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Asia</SelectLabel>
                    <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                    <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                    <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                    <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                    <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                    <SelectItem value="ist_indonesia">
                      Indonesia Central Standard Time (WITA)
                    </SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Australia & Pacific</SelectLabel>
                    <SelectItem value="awst">
                      Australian Western Standard Time (AWST)
                    </SelectItem>
                    <SelectItem value="acst">
                      Australian Central Standard Time (ACST)
                    </SelectItem>
                    <SelectItem value="aest">
                      Australian Eastern Standard Time (AEST)
                    </SelectItem>
                    <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                    <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>South America</SelectLabel>
                    <SelectItem value="art">Argentina Time (ART)</SelectItem>
                    <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                    <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                    <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <TagsInput
                value={formData.tags || []}
                onChange={(tags: string[]) => setFormData(prev => ({ ...prev, tags }))}
                suggestions={distinctTags}
                placeholder="Type to add tags..."
                disabled={isCreating || isUpdating}
                maxTags={10}
              />
            </div>

          </div>

          <SheetFooter>
            <Button variant="outline" onClick={handleCloseSheet}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isCreating || isUpdating}>
              {isCreating || isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {editingContact ? "Updating..." : "Creating..."}
                </>
              ) : editingContact ? (
                "Update Contact"
              ) : (
                "Create Contact"
              )}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, contact: null })}
        onConfirm={handleDelete}
        title="Delete Contact"
        itemName={`${deleteModal.contact?.name}`}
        description="This action cannot be undone. This will permanently delete the contact and all associated data."
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Contacts;
