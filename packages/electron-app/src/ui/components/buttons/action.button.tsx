import React from "react";
import { css } from "@emotion/react";
import { Button } from "@dyson/components/atoms";

interface IProps { title: string; className?: string; id?: string; onClick?: any }
const ActionButton = ({ title, id, className, onClick }: IProps) => {
    const handleClick = React.useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
    }, [onClick]);

	return (
		<Button
            id={id}
			onClick={handleClick}
			className={`${className}`}
			bgColor="tertiary-outline"
			css={buttonCss}
		>
			<span>{title}</span>
		</Button>
	);
};

const buttonCss = css`
    width: 92rem;
    height: 30rem;
    background: #a966ff;
    border-radius: 6rem;
    font-family: Gilroy;
    font-style: normal;
    font-weight: 600;
    font-size: 14rem;
    line-height: 17rem;
    border: 0.5px solid transparent;
    color: #ffffff;
    :hover {
        border: 0.5px solid #8860de;
    }
`;

export { ActionButton };