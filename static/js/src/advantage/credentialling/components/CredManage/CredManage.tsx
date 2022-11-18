import { CheckboxInput, ContextualMenu, MainTable, Row, Spinner } from "@canonical/react-components";
import { listAllKeys, rotateKey } from "advantage/credentialling/api/keys";
import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";

type ActivationKey = {
    contractItemID: string,
    expirationDate: Date,
    key: string,
    activatedBy?: string,
    productID: string
}
const CredManage = () => {
    const [tab, changeTab] = useState(0);
    const inputRefs = useRef<HTMLButtonElement[] | null[]>([]);
    const [actionLinks, updateActionLinks] = useState<{ children: string, onClick: () => void }[]>([]);
    let { isLoading, data } = useQuery(["ActivationKeys"],
        async () => {
            return listAllKeys("cANU9TzI1bfZ2nnSSSnPdlp30TwdVkLse2vzi1TzKPBc");
        }
    );

    const [tableData, changeTableData] = useState<ActivationKey[]>(data);

    const rotateActivationKeys = (keyIds: string[]) => {
        let tempTableData = tableData;
        for (let i in keyIds) {
            let keyId = keyIds[i];
            rotateKey(keyId).then((response) => {
                for (let d in tableData) {
                    if (tableData[d]["key"] == keyId) {
                        tempTableData[d]["key"] = response["activationKey"];
                        data[d]["key"] = response["activationKey"];
                    }
                }
            });
        }
        changeTableData(tempTableData);
        // hacky but seems to reload the table data \o/                    
        changeTab(tab + 1);
        changeTab(0);
    }

    const switchTab = (
        event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number
    ) => {
        event.preventDefault();
        if (event.key == "ArrowLeft") {
            changeTab((currentIndex - 1) % 4);
            inputRefs.current[(currentIndex - 1) % 4].focus();
        }
        if (event.key == "ArrowRight") {
            changeTab((currentIndex + 1) % 4);
            inputRefs.current[(currentIndex + 1) % 4].focus();
        }
    };

    const [selectedKeyIds, setSelectedKeyIds] = useState<string[]>([]);

    const getKey = (keyId: string) => {
        for (let d in data) {
            console.log(d);
            if (data[d]["key"] == keyId) {
                return data[d];
            }
        }
        return {};
    }

    const handleCheckbox = (event: React.SyntheticEvent, keyValue: string) => {
        console.log("checked", event.target.checked);
        if (event.target.checked == true) {
            setSelectedKeyIds(selectedKeyIds.concat(keyValue));
        }
        else {
            setSelectedKeyIds(selectedKeyIds => selectedKeyIds.filter(id => id != keyValue));
        }
        console.log(keyValue, selectedKeyIds);
    };
    const copyToClipboard = (value: string) => {
        console.log(value);
        navigator.clipboard.writeText(value);
    };

    const keyIsArchivable = (keyItemId: string) => {
        let tempKey = getKey(keyItemId);
        if (("activatedBy" in tempKey)) {
            return true;
        }
        return false;
    }

    const isArchiveable = () => {
        for (let i = 0; i < selectedKeyIds.length; i++) {
            if (!keyIsArchivable(selectedKeyIds[i])) {
                return false;
            }
        }
        return true;
    }

    const keyIsUnused = (keyItemId: string) => {
        let tempKey = getKey(keyItemId);
        if (("activatedBy" in tempKey)) {
            return false;
        }
        return true;
    }

    const isUnused = () => {
        for (let i = 0; i < selectedKeyIds.length; i++) {
            if (!keyIsUnused(selectedKeyIds[i])) {
                return false;
            }
        }
        return true;
    }

    useEffect(() => {
        let newList = [];
        if (isArchiveable()) {
            newList.push({
                children: "Archive",
                onClick: () => { }
            });
        }
        if (isUnused()) {
            newList.push({
                children: "Copy List",
                onClick: () => { navigator.clipboard.writeText(selectedKeyIds.join(",")) }
            });
            newList.push({
                children: "Refresh Keys",
                onClick: () => { rotateActivationKeys(selectedKeyIds); setSelectedKeyIds([]); }
            });
        }
        if (newList.length == 0) {
            newList.push({
                children: "No bulk options available",
                onClick: () => { }
            });
        }
        updateActionLinks(newList);
        console.log(isArchiveable());
    }, [selectedKeyIds])

    useEffect(() => {
        if (tab == 0) {
            changeTableData(data);
        }
        if (tab == 1) {
            changeTableData(data.filter((keyItem: ActivationKey) => { return keyIsUnused(keyItem["key"]) }))
        }
        if (tab == 2) {
            changeTableData(data.filter((keyItem: ActivationKey) => { return !keyIsArchivable(keyItem["key"]) }))
        }
    }, [tab]);

    useEffect(() => {
        changeTab(0);
        changeTableData(data);
        console.log(data);
    }, [data]);

    return (<div>
        <Row>
            <h1>Manage exam attempts</h1>
            <p>The table below shows exam attempts you have purchased</p>
            <p>To redeem an attempt, copy the associated key and paste it where the system asks you for the attempt key</p>
        </Row>
        <Row>
            <div className="p-segmented-control col-6">
                <div
                    className="p-segmented-control__list"
                    role="tablist"
                    aria-label="Activatation Keys Table Filter"
                >
                    <button
                        className="p-segmented-control__button"
                        role="tab"
                        aria-selected={tab == 0}
                        aria-controls="all-keys-tab"
                        id="all-keys"
                        onClick={() => {
                            changeTab(0);
                        }}
                        onKeyUp={(e) => {
                            switchTab(e, 4);
                        }}
                        ref={(ref) => (inputRefs.current[0] = ref)}
                    >
                        All Keys
                    </button>
                    <button
                        className="p-segmented-control__button"
                        role="tab"
                        aria-selected={tab == 1}
                        aria-controls="unused-keys-tab"
                        id="unused-keys"
                        tabIndex={-1}
                        onClick={() => {
                            changeTab(1);
                        }}
                        onKeyUp={(e) => {
                            switchTab(e, 1);
                        }}
                        ref={(ref) => (inputRefs.current[1] = ref)}
                    >
                        Unused Keys
                    </button>
                    <button
                        className="p-segmented-control__button"
                        role="tab"
                        aria-selected={tab == 2}
                        aria-controls="active-keys-tab"
                        id="active-keys"
                        tabIndex={-1}
                        onClick={() => {
                            changeTab(2);
                        }}
                        onKeyUp={(e) => {
                            switchTab(e, 2);
                        }}
                        ref={(ref) => (inputRefs.current[2] = ref)}
                    >
                        Active Keys
                    </button>
                    <button
                        className="p-segmented-control__button"
                        role="tab"
                        aria-selected={tab == 3}
                        aria-controls="archived-keys-tab"
                        id="archived-keys"
                        tabIndex={-1}
                        onClick={() => {
                            changeTab(3);
                        }}
                        onKeyUp={(e) => {
                            switchTab(e, 3);
                        }}
                        ref={(ref) => (inputRefs.current[3] = ref)}
                    >
                        Archived Keys
                    </button>
                </div>
            </div>
            <div className="col-6 u-align--center">
                {selectedKeyIds.length > 0 ?
                    <ContextualMenu
                        hasToggleIcon
                        links={actionLinks}
                        position="right"
                        toggleLabel="Actions"
                    /> : ""}
            </div>
        </Row>
        <Row>
            {isLoading ? <Spinner /> :
                <MainTable
                    headers={
                        [
                            {
                                content: "",
                                sortKey: "checkbox"
                            },
                            {
                                content: "Exam Key Id",
                                sortKey: "key"
                            },
                            {
                                content: "",
                            },
                            {
                                content: "Assignee",
                                sortKey: "activatedBy"
                            },
                            {
                                content: ""
                            },
                            {
                                content: "Exam",
                                sortKey: "productID",
                            },
                            {
                                content: "ExpirationDate",
                                sortKey: "expirationDate"
                            }
                        ]
                    }
                    rows={tableData &&
                        tableData.map((keyitem: ActivationKey) => {
                            return ({
                                columns: [
                                    {
                                        content: <CheckboxInput onChange={(event) => { handleCheckbox(event, keyitem["key"]) }} label="" id={keyitem["key"] + "_checkbox"} />
                                    },
                                    {
                                        content: keyitem["key"]
                                    },
                                    {
                                        content: <a onClick={() => { copyToClipboard(keyitem.key); }}><i className="p-icon--copy"></i></a>
                                    },
                                    {
                                        content: keyitem["activatedBy"] ? keyitem["activatedBy"] : "N/A"
                                    },
                                    {
                                        content: <a onClick={() => { rotateActivationKeys([keyitem.key]) }}><i className="p-icon--restart"></i></a>
                                    },
                                    {
                                        content: keyitem.productID
                                    },
                                    {
                                        content: keyitem.expirationDate.toString()
                                    },
                                ],
                                sortData: {
                                    ...keyitem,
                                    checkbox: keyitem["key"]
                                }
                            }
                            );
                        })
                    }
                    paginate={5}
                    sortable
                />
            }
        </Row>
    </div>);
};
export default CredManage;
