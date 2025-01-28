import logo from '@/assets/logo.svg';

export function Logo({minimize}: {minimize?: boolean}){

  return (
    <div className='flex gap-2' >
      <img src={logo} alt="Logo" width="30" />
      {!minimize&&(
        <h1 className="font-bold text-3xl text-blue-400" >
        oTrack
        {/* <span className="text-blue-400" >Facility</span> */}
      </h1>
      )}
    </div>
  )
}