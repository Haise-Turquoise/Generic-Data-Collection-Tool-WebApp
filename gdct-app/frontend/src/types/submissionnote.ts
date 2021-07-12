export default interface SubmissionNote{
    _id: string,
    submissionId:string,
    note?:string,
    updatedDate:Date,
    role:string,
    _v?:number,
}