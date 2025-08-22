import { useEffect, useState, useCallback, memo } from "react"
import { Company } from "@/lib/models/Company"
import { getAllCompanies } from "@/lib/services/auth-service"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const CompanySelectComponent = ({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) => {
  const [companies, setCompanies] = useState<Company[]>([])

  const fetchCompanies = useCallback(async () => {
    const companiesData = await getAllCompanies()
    setCompanies(companiesData)
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  return (
    <div className="space-y-2">
      <Label htmlFor="company">Company</Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.companyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const CompanySelect = memo(CompanySelectComponent);
