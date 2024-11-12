// @ts-ignore
import React from "react";
import InstanceForm from "../../commons/InstanceForm";
import {InstanceState} from "../../../contexts/InstanceContext";
import {_defaultState} from "../../../contexts/InstanceContext";
import {useNavigate} from "react-router-dom";
export const PAGE_ID_ADD_INSTANCE = 'instance-form-page';

const Page = () => {
    const navigate = useNavigate()
    return (
        <div data-testid={PAGE_ID_ADD_INSTANCE}
             id="pageHome"
             className="w-full flex flex-col items-center">
                <div className="p-2 flex flex-col h-lvh w-full items-center justify-center bg-primary-faint">
                    <div className="p-5 w-full md:w-1/3 border border-gray-200 shadow-lg rounded flex flex-col justify-center bg-white">
                        <img src="/img/meili-logo.svg" className="h-8 me-3" alt="FlowBite Logo"/>
                        <InstanceForm
                            defaultInstance={_defaultState}
                            formSubmitCallback={(newInstance: InstanceState) => {
                                localStorage.setItem("instance", JSON.stringify(newInstance));
                                navigate("/instance/");
                            }}
                        >
                            <button
                                className="w-full py-3 border border-primary rounded text-primary font-semibold transition-all ease-in-out hover:bg-primary hover:text-white"
                                type="submit">
                                Add
                            </button>
                        </InstanceForm>
                    </div>
                </div>
        </div>
    );
};

export default Page;