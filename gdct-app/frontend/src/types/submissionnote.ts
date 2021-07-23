export default interface SubmissionNote{
    _id: string,
    submissionId:string,
    note?:string,
    updatedDate:string,
    updatedBy: string,
    role:string,
    _v?:number,
}