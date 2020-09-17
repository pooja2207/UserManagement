<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Exception;
use Lang;
use DB;
use Storage;
use Carbon\Carbon;
class UserController extends Controller
{

    private $profile_picture_display_path;
    private $profile_picture_upload_path;


    public function __construct(){
        $this->profile_picture_display_path = config('app.app_root').config('app.img_path.profile_picture');
        $this->profile_picture_upload_path = storage_path('images');
    }
     public function allUsers(Request $request){
    	try{

    	$resultSet = User::get();
		$otherData['count'] = $resultSet->count();
    	$otherData['image_path'] = $this->profile_picture_display_path;

        if($resultSet->count() > 0){

        	return response()->json(
                [
                    'status' => 'success',
                    'message' => Lang::get('messages.user_index_data'),
                    'data'=>$resultSet,
                    'other_data'=>$otherData,
                    'status_code' => 200,
                ], 200
            );
        	
         }else{
            $resultSet = array();

            return response()->json(
                [
                    'status' => 'success',
                    'message' => Lang::get('messages.user_not_found'),
                 'data'=>$resultSet,
                    'status_code' => 400,
                ], 200
            );
         
         }

       }catch(Exception $ex){

       	return response()->json(
                [
                    'status' => 'error',
                    'message' => $ex->getMessage(),
                    'error_details' => 'on line : '.$ex->getLine().' on file : '.$ex->getFile(),
                    'status_code' => 400,
                ], 400
            );

    	
    }
}

 public function AddUser(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required',
                'email' => 'required'
                ]);

            if ($validator->fails()) {
                foreach ($validator->messages()->getMessages() as $field_name => $messages) {
                    throw new Exception($messages[0], 1);
                }
            }
            $userscount = User::where([
                ['email', '=',  strtolower($request->email)],
            ])->count();

            


            if ($userscount) {
                throw new Exception('User already registered with same email ID.', 1);
            }
            DB::beginTransaction();
            $profile_image = $request->file('myfile');

            $file_name = null;
            if ($profile_image) {
                
                 $file_name = uniqid().'.'.$profile_image->getClientOriginalExtension();
                 Storage::disk('public')->put($file_name, $profile_image);
                
            }

            // $user = new User();
            // $user->name =  ucwords($request->name);
            // $user->email = strtolower($request->email);
            // $user->join_date = Carbon::format($request->join_date);
            // $user->end_date = Carbon::format($request->end_date);
            // $user->is_working = $request->is_working;
            // if(isset($file_name)){
            //      $user->profile = $file_name;
            // }
            // $user->save();
           

            

            $profile =  User::where('users.id', $user->id)->first();
            $otherData['image_path'] = $this->profile_picture_display_path;

           DB::commit();
           return response()->json(
                [
                    'status' => 'success',
                    'message' => Lang::get('messages.user_add'),
                    'data'=>$profile,
                     'other_data'=>$otherData,
                    'status_code' => 200,
                ], 200
            );
            
           
    } catch (\Exception $ex) {
         DB::rollback();

            return response()->json(
                [
                    'status' => 'error',
                    'message' => $ex->getMessage(),
                    'error_details' => 'on line : '.$ex->getLine().' on file : '.$ex->getFile(),
                    'status_code' => 400,
                ], 400
            );
            
        }
    }


   

    public function destroy(Request $request, $id)
   {
       try {
            
            $user = User::where('id', $request->id)->delete();
            return $this->sendResponse([],'User deleted permanently.');
            
       } catch (\Exception $ex) {
           return response()->json([
               'status' => 'error',
               'message' => $ex->getMessage(),
               'error_details' => 'on line : '.$ex->getLine().' on file : '.$ex->getFile(),
           ], 400);
       }
   }


}
