
import React from 'react';
import { Input } from '@/components/ui/input';
import DocumentUploadFixed from '@/components/DocumentUploadFixed';

interface PatientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  medicalHistory: string;
}

interface PatientInformationProps {
  patientInfo: PatientInfo;
  onPatientInfoChange: (info: PatientInfo) => void;
  clinicId?: string;
}

const PatientInformation: React.FC<PatientInformationProps> = ({
  patientInfo,
  onPatientInfoChange,
  clinicId
}) => {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    onPatientInfoChange({
      ...patientInfo,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <Input
              value={patientInfo.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <Input
              value={patientInfo.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={patientInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <Input
            type="tel"
            value={patientInfo.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <DocumentUploadFixed
          clinicId={clinicId}
          onUploadComplete={(fileUrl, fileName) => {
            console.log('Document uploaded:', fileName, fileUrl);
          }}
        />
      </div>
    </div>
  );
};

export default PatientInformation;
