import { Document } from "mongoose";

export default interface AttributeConfig {
    attributeKeyword: string;
    code: string;
    updatedBy: string;
    updatedAt: Date;
}

export interface AttributeConfigDoc extends AttributeConfig, Document {}
