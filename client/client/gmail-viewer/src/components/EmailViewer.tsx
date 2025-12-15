import moment from "moment";

const EmailaViewer = ({ email }: any) => {

    const convertDate = (date: string) => {
        return moment(date).format('MMMM Do YYYY, h:mm:ss');
    }
    
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800" style={{paddingLeft:"5px"}}>
                {email?.body?.subject?.[0]}
            </h3>
            <p className="text-sm text-gray-600 mt-1" style={{paddingRight:"10px"}}>
                {convertDate(email?.body?.date?.[0])}
            </p>
            {/* You can add more email details here, e.g., sender, snippet */}
        </div>
    );
};

export default EmailaViewer;