import { Document } from "mongoose";

export default interface AttributeConfig {
    attributeKeyword: string;
    code: string;
    updatedBy: string;
    updatedAt: string;
}

export interface AttributeConfigDoc extends AttributeConfig, Document {}
