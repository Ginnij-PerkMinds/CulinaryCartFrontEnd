

export interface ChargeDto {
  chargeId: number;
  chargeType: string;
  value: number;
  isActive: boolean;
}

export interface AddChargeRequest {
  chargeType: string;
  value: number;   
  isActive: boolean;
}

export interface UpdateChargeRequest {
  chargeId: number;
  chargeType: string;
  value: number;  
  isActive: boolean;
}
