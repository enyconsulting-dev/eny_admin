import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your dashboard preferences</p>
        </div>
        
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>Settings panel will be available here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will contain various configuration options including:
            </p>
            <ul className="list-disc list-inside mt-2 text-muted-foreground space-y-1">
              <li>Account preferences</li>
              <li>Notification settings</li>
              <li>Theme customization</li>
              <li>API integrations</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;