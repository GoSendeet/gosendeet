import Layout from "@/layouts/BookingFlowLayout";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import openChatwootChat from "@/lib/openChatwootChat";
import { track, EVENT } from "@/lib/analytics";
import { FaWhatsapp } from "react-icons/fa";
import { handleBackToWhatsapp } from "../whatsappUtil";
import { useParams, useSearchParams } from "react-router-dom";

const Confirmation = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const userWhatsappNumber = params?.whatsappPhoneNumber || "";
    const reference = searchParams.get("reference")
        || searchParams.get("trxref")
        || "";
    console.log("User whatsapp number:", userWhatsappNumber);
    console.log("Reference:", reference);
    return (
        <Layout>
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-10">
                <div className="w-full max-w-3xl">
                    <div className="px-6 py-20 bg-neutral900 rounded-xl">
                        <div className="flex flex-col gap-2 justify-center items-center text-center">
                            <div className="w-[70px] h-[70px] rounded-full bg-green500 text-white flex justify-center items-center">
                                <Check size={50} />
                            </div>

                            <h2 className="font-clash font-semibold text-2xl mt-1">
                                Order Placed Successfully
                            </h2>

                            <div className="text-neutral600 md:w-[90%] mb-6">
                                <p>Sit back and relax.</p>
                                <p>
                                    Your order is being processed and you will get a response
                                    from us in approximately 15 minutes.
                                </p>
                            </div>

                            <Button
                                onClick={() => handleBackToWhatsapp(userWhatsappNumber)}
                                className="bg-green-500 hover:bg-green-600 from-transparent to-transparent"
                            >
                                <FaWhatsapp />
                                Back to Whatsapp
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4 items-center justify-center mt-18">
                            <p className="font-medium">Need help with delivery?</p>

                            <div className="flex flex-col lg:flex-row items-center justify-center gap-4">
                                <Button
                                    variant="secondary"
                                    className="bg-green-500"
                                    onClick={(e) => {
                                        track(EVENT.SUPPORT_OPENED, {
                                            channel: "chat",
                                            source: "confirmation",
                                        });
                                        openChatwootChat(e);
                                    }}
                                >
                                    Live Chat
                                </Button>

                                <Button
                                    variant="secondary"
                                    className="bg-brand"
                                    onClick={() => {
                                        track(EVENT.SUPPORT_OPENED, {
                                            channel: "whatsapp",
                                            source: "confirmation",
                                        });
                                    }}
                                >
                                    WhatsApp Support
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Confirmation;