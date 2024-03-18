'use client'

const Follow = () => {

    const onClick = () => {
        //if not logged in send to auth

    }
  
    return (
    <div className="flex flex-col">
        <div className="flex items-center justify-between px-5 pt-4">
            <div className="inline-flex items-center gap-x-2">
                {/*all the weird 'components' are just icons we got from react-icons*/}
                <p className='text-neutral-400 font-medium text-md'>Follow List</p>
            </div>
        </div>
    </div>
  )
}

export default Follow