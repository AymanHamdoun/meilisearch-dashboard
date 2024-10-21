// @ts-ignore
import React from "react";
import InstanceForm from "../../commons/InstanceForm";
import {InstanceState} from "../../../contexts/InstanceContext";
import {_defaultState} from "../../../contexts/MeiliIndexContext";
export const PAGE_ID_ADD_INSTANCE = 'instance-form-page';

const Page = () => {
    return (
        <div data-testid={PAGE_ID_ADD_INSTANCE}
             id="pageHome"
             className="p-5 w-full flex flex-col items-center">
                <div>
                    <InstanceForm
                        defaultInstance={_defaultState}
                        formSubmitCallback={(newInstance: InstanceState) => {
                            localStorage.setItem("instance", JSON.stringify(newInstance));
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
    );
};

export default Page;