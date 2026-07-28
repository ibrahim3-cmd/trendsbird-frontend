/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useUpdateMeMutation } from "@/redux/features/user/user.api";
import { useUploadFileMutation } from "@/redux/features/upload/uploadApiSlice";
import type { IUser } from "@/types/user.type";
import { UserRoundPen } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import ImageUploadPreview from "@/components/ui/ImageUploadPreview";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

/** tiny skeleton */
const Skel: React.FC<{ w?: number | string; h?: number | string }> = ({ w = 160, h = 16 }) => (
  <div className="bg-muted animate-pulse rounded" style={{ width: w, height: h }} />
);

const ProfileSettings: React.FC = () => {
  const { data: me, isLoading, isFetching, refetch } = useUserInfoQuery(undefined);
  const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
  const [uploadFile] = useUploadFileMutation();

  // Profile tabs

  const user = me?.data as IUser | undefined;
  const loading = isLoading || isFetching;

  // edit toggles
  const [editing, setEditing] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

  // form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    picture: "",
    address: "",
  });

  // Track selected profile picture file
  const [selectedPictureFile, setSelectedPictureFile] = useState<File | null>(null);

  // hydrate form when user info loads
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        picture: (user as any).picture || "",
        address: (user as any).address || "",
        password: "",
      }));
    }
  }, [user]);

  const onChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if(key === "phone") {
        const v = e.target.value.replace(/\D/g, '');
        setForm((f) => ({ ...f, [key]: v }));
        return;
      }
      const v = e.target.value;
      setForm((f) => ({ ...f, [key]: v }));
    };

  // diff: send only changed keys (and password if set & confirmed)
  const dirty = useMemo(() => {
    if (!user) return {};
    const out: Record<string, any> = {};
    if (form.name !== (user.name || "")) out.name = form.name;
    if (form.email !== (user.email || "")) out.email = form.email;
    if (form.phone !== (user.phone || "")) out.phone = form.phone;
    if (form.picture !== ((user as any).picture || "")) out.picture = form.picture;
    if (form.address !== ((user as any).address || "")) out.address = form.address;
    return out;
  }, [user, form]);

  const hasChanges = Object.keys(dirty).length > 0;

  // Handle image selection
  const handleImageSelect = (file: File | null) => {
    setSelectedPictureFile(file);
  };

  // Upload image function
  const uploadPictureImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await uploadFile(formData).unwrap();
      return result.data.url; // Assuming the API returns { data: { url: 'uploaded-image-url' } }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload profile picture');
    }
  };

  const cancel = () => {
    if (!user) return;
    setEditing(false);
    // setShowPassword(false);
    setSelectedPictureFile(null);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      picture: (user as any).picture || "",
      address: (user as any).address || "",
    });
  };

  const save = async () => {
    if (!hasChanges && !selectedPictureFile) {
      toast.info("Nothing to update");
      setEditing(false);
    //   setShowPassword(false);
      return;
    }
    // basic validations
    if (dirty.email && !/^\S+@\S+\.\S+$/.test(dirty.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      let pictureUrl = form.picture;

      // Upload profile picture if a new one was selected
      if (selectedPictureFile) {
        try {
          pictureUrl = await uploadPictureImage(selectedPictureFile);
          toast.success('Profile picture uploaded successfully');
        } catch (error) {
          toast.error('Failed to upload profile picture. Please try again.');
          return;
        }
      }

      // Prepare update data
      const updateData = {
        ...dirty,
        ...(selectedPictureFile && { picture: pictureUrl })
      };

      await updateMe(updateData).unwrap();
      toast.success("Profile updated");
      setEditing(false);
      setSelectedPictureFile(null);
    //   setShowPassword(false);
      await refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  return (
    <div>
      {/* Page Header with tabs */}
      <PageHeader
        title="My Profile"
        description="Manage your personal informations."
        icon={UserRoundPen}
        // tabs={profileTabs}
      />
      
      <div className="mx-auto min-w-2xl py-5">
      <Card className="border shadow-lg rounded-2xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-black dark:text-white drop-shadow">My Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Basic info */}
          <section className="grid grid-cols-1 gap-4">
            {/* Profile Picture Section */}
            <div className="max-w-48 mx-auto">
              {/* <Label className="text-sm font-medium mb-3 block">Profile Picture</Label> */}
              {loading || !user ? (
                <div className=""><Skel w={120} h={120} /></div>
              ) : editing ? (
                <ImageUploadPreview
                  value={form.picture}
                  onImageSelect={handleImageSelect}
                  width={120}
                  height={120}
                  maxSizeInMB={5}
                  uploadButtonText="Upload Profile Image"
                  changeButtonText="Change Image"
                  className="flex flex-col items-center justify-center"
                  altText="Profile Picture"
                />
              ) : (
                <div className="flex items-center gap-4">
                  {(user as any).picture ? (
                    <img
                      src={(user as any).picture}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
                      <span className="text-muted-foreground text-xs">No picture</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <Label className="text-xs">Name</Label>
                {loading || !user ? (
                  <div className="mt-2"><Skel w={220} /></div>
                ) : editing ? (
                  <Input className="mt-2" value={form.name} onChange={onChange("name")} placeholder="Your name" />
                ) : (
                  <div className="mt-2 text-sm">{user.name || "—"}</div>
                )}
              </div>

              {/* Email */}
              <div>
                <Label className="text-xs">Email</Label>
                {loading || !user ? (
                  <div className="mt-2"><Skel w={260} /></div>
                ) : editing ? (
                  <Input className="mt-2" value={form.email} onChange={onChange("email")} placeholder="you@example.com" />
                ) : (
                  <div className="mt-2 text-sm">{user.email || "—"}</div>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label className="text-xs">Phone</Label>
                {loading || !user ? (
                  <div className="mt-2"><Skel w={200} /></div>
                ) : editing ? (
                  <Input className="mt-2" value={formatPhoneNumber(form.phone)} onChange={onChange("phone")} placeholder="+880..." />
                ) : (
                  <div className="mt-2 text-sm">{formatPhoneNumber(user.phone || "") || "—"}</div>
                )}
              </div>

              {/* Address */}
              <div>
                <Label className="text-xs">Address</Label>
                {loading || !user ? (
                  <div className="mt-2"><Skel w={280} /></div>
                ) : editing ? (
                  <Input className="mt-2" value={form.address} onChange={onChange("address")} placeholder="Street, city, country" />
                ) : (
                  <div className="mt-2 text-sm">{(user as any).address || "—"}</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!editing ? (
                <Button size="sm" className="rounded-xl" onClick={() => setEditing(true)} disabled={loading}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button size="sm" className="rounded-xl" onClick={save} disabled={saving || (!hasChanges && !selectedPictureFile)}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={cancel} disabled={saving}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default ProfileSettings;
