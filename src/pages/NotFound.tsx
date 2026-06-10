import { Button } from '@mui/material'
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="bg-[#ddf5ff] w-screen h-screen flex flex-col md:flex-row items-center justify-between">
      <div className='mx-auto'>
        <div className='flex items-center justify-center'>
          <h1 className='text-[2vw] font-semibold'>
            وجود ندارد !
          </h1>
          <h1 className='text-[4vw] font-extrabold'>
            ۴۰۴
          </h1>
        </div>
        <div className='flex flex-col gap-y-5'>
          <p className='text-[1vw] font-semibold'>
            صفحه ای که به دنبال آن بودید در بازدید فنی یافت نشد
          </p>
          <Link to="/dashboard" className='mx-5 py-2 border border-dashed border-zinc-400 rounded-[10px]'>
            <Button fullWidth className='text-black text-[1vw]'>
              بازگشت به داشبورد
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}