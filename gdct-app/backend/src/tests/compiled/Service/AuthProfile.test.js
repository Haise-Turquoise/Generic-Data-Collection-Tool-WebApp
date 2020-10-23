import AuthService from '../../../services/Auth/'

const mockRequest = {
           user: { email: "test@test.com" },
         };


const req = mockRequest;

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
const res = mockResponse
const next = (error)=>{return error;}
test('user profile is Undefined', ()=>{
        expect(AuthService.prototype.profile(req,res,next)).toBeUndefined()
    }
)



