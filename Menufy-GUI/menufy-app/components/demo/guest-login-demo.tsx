'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/providers/toast-provider';

import { fetchGuestLoginParams as fetchParamsFromService, GuestLoginParams as ServiceGuestLoginParams } from '@/lib/services/auth-service';

interface GuestLoginParams {
  uid: string;
  ctr: string;
  cmac: string;
}

type GuestLoginData = ServiceGuestLoginParams;

interface ParsedGuestLogin {
  companyName: string;
  tableId: string;
  params: GuestLoginParams;
  originalKey: string;
}

interface GroupedGuestLogins {
  [companyName: string]: ParsedGuestLogin[];
}

export const GuestLoginDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingParams, setIsFetchingParams] = useState(false);
  const [guestLoginData, setGuestLoginData] = useState<GuestLoginData>({});
  const { showToast } = useToast();

  // Parse URL parameters from the query string
  const parseUrlParams = (queryString: string): GuestLoginParams => {
    const params = new URLSearchParams(queryString.startsWith('?') ? queryString.slice(1) : queryString);
    return {
      uid: params.get('uid') || '',
      ctr: params.get('ctr') || '',
      cmac: params.get('cmac') || ''
    };
  };

  // Parse company name and table ID from key like "Acme-CRO::9030832E686413A1"
  const parseGuestLoginKey = (key: string): { companyName: string; tableId: string } => {
    const parts = key.split('::');
    return {
      companyName: parts[0] || '',
      tableId: parts[1] || ''
    };
  };

  // Group guest logins by company name
  const groupGuestLoginsByCompany = (data: GuestLoginData): GroupedGuestLogins => {
    const grouped: GroupedGuestLogins = {};
    
    Object.entries(data).forEach(([key, queryString]) => {
      const { companyName, tableId } = parseGuestLoginKey(key);
      const params = parseUrlParams(queryString);
      
      if (!grouped[companyName]) {
        grouped[companyName] = [];
      }
      
      grouped[companyName].push({
        companyName,
        tableId,
        params,
        originalKey: key
      });
    });
    
    return grouped;
  };

  // Fetch guest login parameters using the auth service
  const fetchGuestLoginParams = async () => {
    setIsFetchingParams(true);
    setGuestLoginData({});
    try {
      const data = await fetchParamsFromService();
      setGuestLoginData(data);
    } catch {
      showToast('Network error while fetching guest login parameters', 'error');
    } finally {
      setIsFetchingParams(false);
    }
  };

  // Fetch parameters on component mount
  useEffect(() => {
    fetchGuestLoginParams();
  }, []);

  const handleGuestLogin = async (params?: GuestLoginParams) => {
    // Use provided params or default test values
    const loginParams = params || { uid: '', ctr: '', cmac: '' };
    setIsLoading(true);
    
    try {
      // Create URL with GET parameters for guest login
      const searchParams = new URLSearchParams({
        uid: loginParams.uid,
        ctr: loginParams.ctr,
        cmac: loginParams.cmac
      });
      
      const guestLoginUrl = `/login/guest?${searchParams.toString()}`;
      
      showToast('Redirecting to guest login...', 'info');
      
      // Redirect to the guest login page with parameters
      window.location.href = guestLoginUrl;
      
    } catch (error) {
      showToast('Error preparing guest login', 'error');
      console.error('Guest login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🍽️ Guest Access
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Experience the customer view by signing in as a guest. Perfect for viewing menus and placing orders.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 mb-2">What you can do as a guest:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Browse restaurant menus</li>
            <li>• Place orders</li>
            <li>• View order history</li>
            <li>• Track order status</li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">Available Guest Logins:</h4>
            <Button
              onClick={fetchGuestLoginParams}
              disabled={isFetchingParams}
              size="sm"
              variant="ghost"
              className="text-blue-700 hover:text-blue-900"
            >
              {isFetchingParams ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          
          {Object.keys(guestLoginData).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupGuestLoginsByCompany(guestLoginData)).map(([companyName, logins]) => (
                <div key={companyName} className="bg-white rounded-lg border">
                  <div className="bg-gray-50 px-3 py-2 rounded-t-lg border-b">
                    <h5 className="font-semibold text-sm text-gray-800">🏢 {companyName}</h5>
                    <p className="text-xs text-gray-600">{logins.length} table{logins.length !== 1 ? 's' : ''} available</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {logins.map((login) => (
                      <div key={login.originalKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-700">
                            🪑 Table: {login.tableId}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            UID: {login.params.uid} | CTR: {login.params.ctr} | CMAC: {login.params.cmac.slice(0, 8)}...
                          </div>
                        </div>
                        <Button
                          onClick={() => handleGuestLogin(login.params)}
                          disabled={isLoading}
                          size="sm"
                          className="ml-3 flex-shrink-0"
                        >
                          {isLoading ? 'Signing...' : 'Sign In'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-blue-700">
              {isFetchingParams ? 'Loading guest login options...' : 'No guest login options available.'}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
