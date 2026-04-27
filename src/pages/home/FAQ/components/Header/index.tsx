// import account from "@/assets/icons/circle-user.png";
// import files from "@/assets/icons/file-circle-question.png";
// import team from "@/assets/icons/user-group.png";
// import billing from "@/assets/icons/credit-card.png";
const Header = () => {
  return (
    <div className="md:px-20 px-6 py-20 bg-brand-light flex flex-col justify-center items-center ">
      <h1 className="lg:text-[46px] md:text-[36px] text-[30px] text-center font-clash font-semibold leading-[130%] mb-2">
        Frequently Asked{" "}
        <span className="font-tiempos font-normal italic">Questions</span>{" "}
      </h1>
      <p className="xl:w-1/3 lg:w-3/5 md:w-3/4 text-center mb-8">
        The fastest way to us is exploring our collection of questions asked
        often buy our users and potential customers
      </p>
      {/* <div className="flex items-center md:gap-4 gap-2">
        <div className="md:py-4 md:px-6 p-2 md:w-[100px] w-[60px] bg-white flex flex-col gap-2 items-center justify-center ">
          <img src={account} alt="account" className="md:w-auto w-[25px]" />
          <p className="md:text-sm text-xs font-medium text-neutral600">
            Account
          </p>
        </div>
        <div className="md:py-4 md:px-6 p-2 md:w-[100px] w-[60px] bg-white flex flex-col gap-2 items-center justify-center ">
          <img src={files} alt="files" className="md:w-auto w-[25px]" />
          <p className="md:text-sm text-xs font-medium text-neutral600">
            Files
          </p>
        </div>
        <div className="md:py-4 md:px-6 p-2 md:w-[100px] w-[60px] bg-white flex flex-col gap-2 items-center justify-center ">
          <img src={team} alt="team" className="md:w-auto w-[25px]" />
          <p className="md:text-sm text-xs font-medium text-neutral600">Team</p>
        </div>
        <div className="md:py-4 md:px-6 p-2 md:w-[100px] w-[60px] bg-white flex flex-col gap-2 items-center justify-center ">
          <img src={billing} alt="billing" className="md:w-auto w-[25px]" />
          <p className="md:text-sm text-xs font-medium text-neutral600">
            Billing
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Header;
