import logo from '@/assets/logo.png';

export function Logo({minimize}: {minimize?: boolean}){

  return (
    <div className='flex' >
      <img src={logo} alt="Logo" width="30" />
      {!minimize&&(
        <h1 className="font-extrabold text-2xl text-lime-500" >
        Portal
        <span className="text-blue-400" >Facility</span>
      </h1>
      )}
    </div>
  )
}