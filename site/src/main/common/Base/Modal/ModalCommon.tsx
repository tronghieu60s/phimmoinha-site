import React from 'react';

type Props = {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
};

export default function ModalCommon(props: Props) {
  const { show, onClose, children } = props;

  return (
    <div className={`pm-common-modal${show ? ' show' : ''}`}>
      <div className="pm-common-modal-bg" onClick={onClose} aria-hidden="true" />
      <div className="pm-common-modal-content">{children}</div>
    </div>
  );
}
