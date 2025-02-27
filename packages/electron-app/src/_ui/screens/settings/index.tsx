import React from "react";
import { css } from "@emotion/react";
import { CompactAppLayout } from "../../layout/CompactAppLayout";
import { SettingsModalContent } from "../../../ui/components/toolbar/settingsModal";
import { useNavigate } from "react-router-dom";

const SettingsScreen = () => {
    const navigate = useNavigate();
    const handleClose = React.useCallback(() => {
        return navigate("/");
    }, []);

    return (
        <CompactAppLayout title={<span css={titleCss}>Settings</span>}>
            <div css={contentCss} > 
                <SettingsModalContent css={modalCss} isOpen={true} handleClose={handleClose}/>
            </div>   
        </CompactAppLayout>
    );
}

const titleCss = css`
    font-family: Cera Pro;
    font-style: normal;
    font-weight: 500;
    font-size: 13.4px;
    color: #ffffff;
    margin-left: 36rem;
`;
const contentCss = css`
    display: flex;
    flex: 1; 
    flex-direction: column;
    height: 100%;
`;
const modalCss = css`
    display: flex;
    flex: 1;
    flex-direction: column;
    .submit-action-button {
        margin-top: auto;
    }
`;

export { SettingsScreen };
