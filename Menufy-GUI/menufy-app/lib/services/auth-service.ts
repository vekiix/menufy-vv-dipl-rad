import axiosInstance from "./axios";
import { UserResponse } from "@/lib/res/UserResponse";
import { User } from "@/lib/models/User";
import { LoginGuestResponse, LoginResponse } from "@/lib/res/LoginResponse";
import { CreateUserRequest } from "@/lib/req/CreateUserRequest";
import { Company } from "@/lib/models/Company";
import {  CompaniesResponse } from "@/lib/res/CompaniesResponse";
import { CreateCompanyRequest } from "../req/CreateCompanyRequest";
import { CompanyResponse } from "../res/CompanyResponse";
import { Table } from "../models/Table";
import { TablesResponse } from "../res/TablesResponse";
import { CreateTableRequest } from "../req/CreateTableRequest";
import { TableResponse } from "../res/TableResponse";
import { LoginData } from "../req/LoginData";
import { UsersResponse } from "../res/UsersResponse";




export const updateUser = async (userId:string, request:CreateUserRequest): Promise<User> => {
    const response = await axiosInstance.put<UserResponse>("/user", request, {
      params: {
        user: userId,
      },
    })
    const user = response.data.user;
    const newUser: User = {
      id: user.id,
      password: user.password,
      username: user.username,
      companyId: user.company.id,
      company: user.company.companyName,
      role: user.role.roleName,
      roleId: user.role.id,
      status: user.accountNonExpired && user.accountNonLocked ? "active" : "inactive",
      createdAt: user.createdAt,
    };
    return newUser;
}


export const updateTable = async (tableId:string, request:CreateTableRequest): Promise<Table> => {

    const response = await axiosInstance.put<TableResponse>("/table", request, {
      params: {
        table: tableId,
      },
    });
    const tableObj = response.data.table;
    const updatedTable: Table = {
      uid: tableObj.uid,
      scanCount: tableObj.scanCount,
      tableName: tableObj.tableName
    };

    return updatedTable;
  
}

export const updateCompany = async (companyId:string, request:CreateCompanyRequest): Promise<Company> => {
    const response = await axiosInstance.put<CompanyResponse>("/company", request, {
      params: {
        company: companyId,
      },
    });
    const company = response.data.company;
    const updatedCompany: Company = {
      id: company.id,
      oib: company.oib,
      companyName: company.companyName,
      logo: company.logo,
      encryptionKey: company.encryptionKey,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    };
    return updatedCompany;
}

export const getAllCompanies = async (): Promise<Company[]> => {
    const response = await axiosInstance.get<CompaniesResponse>("/company")
    return response.data.companies;

}

export const getAllTables = async (): Promise<Table[]> => {
  const response = await axiosInstance.get<TablesResponse>("/table")
  return response.data.tables;
}

export const deleteUser = async (userId:string): Promise<User[]> => {

    const response = await axiosInstance.delete<UsersResponse>("/user" , {
      params: {
        user: userId,
      }
    })
    const apiUsers = response.data.users;

    // Map API user objects to simplified User interface
    const users: User[] = apiUsers.map((user) => ({
      id: user.id,
      password: user.password,
      username: user.username,
      companyId: user.company.id,
      company: user.company.companyName,
      role: user.role.roleName,
      roleId: user.role.id,
      status: user.accountNonExpired && user.accountNonLocked ? "active": "inactive",
      createdAt: user.createdAt
    }));

    return users;
 
}

export const deleteCompany = async (companyId: string) => {
    const response = await axiosInstance.delete<CompaniesResponse>("/company" , {
      params: {
        company: companyId,
      }
    })
    const apiCompanies = response.data.companies;

    const companies: Company[] = apiCompanies.map((comp) => ({
      id: comp.id,
      oib: comp.oib,
      companyName: comp.companyName,
      logo: comp.logo,
      encryptionKey: comp.encryptionKey,
      createdAt: comp.createdAt,
      updatedAt: comp.updatedAt
    }));

    return companies;
}

export const deleteTable = async (tableId: string) => {
    const response = await axiosInstance.delete<TablesResponse>("/table" , {
      params: {
        table: tableId,
      }
      
    })
    const apiTables = response.data.tables;

    const tables: Table[] = apiTables.map((table) => ({
      tableName: table.tableName,
      uid: table.uid,
      scanCount: table.scanCount
    }));

    return tables;
}

export const createCompany = async (request: CreateCompanyRequest): Promise<Company> => {

    const response = await axiosInstance.post<CompanyResponse>("/company", request, {

    });
    const company = response.data.company;
    const updatedCompany: Company = {
      id: company.id,
      oib: company.oib,
      companyName: company.companyName,
      logo: company.logo,
      encryptionKey: company.encryptionKey,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt
    };
    return updatedCompany;
};


export const createUser = async (request: CreateUserRequest): Promise<User> => {
    console.log(request)  
  const response = await axiosInstance.post<UserResponse>("/user", request);
    const user = response.data.user;
    const newUser: User = {
      id: user.id,
      password: user.password,
      username: user.username,
      companyId: user.company.id,
      company: user.company.companyName,
      role: user.role.roleName,
      roleId: user.role.id,
      status: user.accountNonExpired && user.accountNonLocked ? "active" : "inactive",
      createdAt: user.createdAt,
    };
    return newUser;
};


export const createTable = async (request: CreateTableRequest): Promise<Table> => {
    const response = await axiosInstance.post<TableResponse>("/table", request);
    const tableObj = response.data.table;
    const createdTable: Table = {
      uid: tableObj.uid,
      scanCount: tableObj.scanCount,
      tableName: tableObj.tableName
    };
    return createdTable;
  
};

export const getAllUsers = async (): Promise<User[]> => {
     const response = await axiosInstance.get<UsersResponse>("/user");

    const apiUsers = response.data.users;

    // Map API user objects to simplified User interface
    const users: User[] = apiUsers.map((user) => ({
      id: user.id,
      password: user.password,
      username: user.username,
      companyId: user.company.id,
      company: user.company.companyName,
      role: user.role.roleName,
      roleId: user.role.id,
      status: user.accountNonExpired && user.accountNonLocked ? "active": "inactive",
      createdAt: user.createdAt
    }));

    return users;
};

export const loginUser = async (credentials: LoginData): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/login", credentials, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    if (response.status === 200 && response.data.accessToken) {
      return response.data;
    } else {
      throw new Error("Unexpected response format from login endpoint.");
    }
};

export const loginGuest = async (uid: string,ctr: string, cmac: string): Promise<LoginGuestResponse> => {
  const response = await axiosInstance.get<LoginGuestResponse>("/login", {
    params:{
      uid: uid,
      ctr: ctr,
      cmac: cmac
    }
  });

  if (response.status === 200 && response.data.accessToken) {
    return response.data;
  } else {
    throw new Error("Unexpected response format from login endpoint.");
  }
};

export interface GuestLoginParams {
  [key: string]: string;
}

export const fetchGuestLoginParams = async (): Promise<GuestLoginParams> => {
  try {
    const response = await axiosInstance.get<GuestLoginParams>('/login/next');
    
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch guest login parameters: ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching guest login parameters:', error);
    throw error;
  }
};
