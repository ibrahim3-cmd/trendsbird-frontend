import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRoundPen } from "lucide-react";

export default function ProfileSettings() {
  const { data, isLoading } = useUserInfoQuery(undefined);
  const user = data?.data;

  return (
    <div>
      <PageHeader title="Profile" description="Your account details." icon={UserRoundPen} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {isLoading ? (
            <p className="text-muted-foreground">Loading profile...</p>
          ) : (
            <>
              <p><span className="font-medium">Name:</span> {user?.name || "—"}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Role:</span> {user?.role || "—"}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
