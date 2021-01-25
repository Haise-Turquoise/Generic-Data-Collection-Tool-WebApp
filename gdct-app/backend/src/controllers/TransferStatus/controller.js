import { Service } from 'typedi';
import { Router } from 'express';
import { authorized } from '../../middlewares/auth/auth';
import TransferStatusService from '../../services/TransferStatus'
import { log } from '../../utils/log/winston';

const TransferStatusController = Service([TransferStatusService], service=>{
    const router = Router();
    return (()=>{
        router.get('/startService/:time', authorized, (req, res, next)=>{
            log.info('start service');
            const { time } = req.params;
            service.startTransferProccess(time).then(()=>res.end()).catch(next);
        })

        router.get('/stopService', authorized, (req, res, next)=>{
            service.closeCurrentTransferProcess().then(()=>res.end()).catch(next);
        })

        router.get('/getServiceStatus', authorized, (req, res, next)=>{
            console.log('controller!')
            service.getTransferStatus().then(status=>res.json({status})).catch(next);
        })
    })
})

export default TransferStatusController;