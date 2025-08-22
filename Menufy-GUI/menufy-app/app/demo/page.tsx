import { DemoHero } from '@/components/demo/demo-hero';
import { GuestLoginDemo } from '@/components/demo/guest-login-demo';
import { OwnerLoginDemo } from '@/components/demo/owner-login-demo';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <DemoHero />
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <GuestLoginDemo />
            <OwnerLoginDemo />
          </div>
          
        </div>
      </div>
    </div>
  );
}
