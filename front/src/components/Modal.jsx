import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Eye, ClockCounterClockwise, X } from "@phosphor-icons/react";
import style from "../css/Modal.module.css";
import { Button } from "./Button";

import Table from "./TableComponents/Table";

const Modal = (props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          className="labels"
          type="submit"
          id="viewButton"
          content={<Eye size={28} />}
        />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={style.DialogOverlay} />
        <Dialog.Content className={style.DialogContent}>
          <Dialog.Title className={style.DialogTitle}>
            <h2>Product History</h2>
            <ClockCounterClockwise size={33} className={style.clockCounter} />
          </Dialog.Title>
          <Dialog.Description className={style.DialogDescription}>
            Here you can see the details of you purchase.
          </Dialog.Description>
          <div>
            <Table
              style="detailDiv"
              route="order_item"
              columns={[
                "CODE",
                "PRODUCT",
                "CATEGORY",
                "AMOUNT",
                "TAX",
                "TOTAL UNIT PRICE",
              ]}
              params={[
                "code",
                "product_name",
                "category_name",
                "amount",
                "tax",
                "price",
              ]}
              code={props.code}
              none
            />
          </div>
          <div>
            <Dialog.Close asChild>
              <Button
                className="labels"
                id={"closeSpan"}
                content={<X size={25} />}
              />
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
