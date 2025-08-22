'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const OwnerLoginDemo = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🏪 Restaurant Owner Access
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Experience the full management dashboard with restaurant owner privileges.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">What you can do as owner:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Manage restaurant information</li>
            <li>• Create and edit menus</li>
            <li>• View and process orders</li>
            <li>• Manage tables and users</li>
            <li>• Configure payment settings</li>
            <li>• Access order history and analytics</li>
          </ul>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Demo Credentials:</h4>
          <div className="space-y-2 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">Username:</div>
              <code className="text-green-700">user</code>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-medium text-gray-700">Password:</div>
              <code className="text-green-700">1234</code>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            * These are demo credentials for testing purposes only
          </p>
        </div>
        <div className="p-4">
        <Link href="/login">
          <Button className="w-full">
            Go to Login Page
          </Button>
        </Link>
        </div>
      </div>
    </Card>
  );
};
