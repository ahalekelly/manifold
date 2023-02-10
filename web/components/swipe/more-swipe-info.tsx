import clsx from 'clsx'
import { BinaryContract } from 'common/contract'
import { richTextToString } from 'common/util/parse'
import { useState } from 'react'
import { useRecentBets } from 'web/hooks/use-bets'
import { BinaryContractChart } from '../charts/contract'
import { Col } from '../layout/col'
import { Modal, MODAL_CLASS } from '../layout/modal'
import { SizedContainer } from '../sized-container'
import { useTimePicker } from '../contract/contract-overview'
import { Content } from '../widgets/editor'
import { Stats } from '../contract/contract-info-dialog'
import { Spacer } from '../layout/spacer'
import { UserBetsSummary } from '../bet/bet-summary'

export function MoreSwipeInfo(props: {
  contract: BinaryContract
  setIsModalOpen: (open: boolean) => void
}) {
  const { contract, setIsModalOpen } = props
  const { description } = contract

  const [isOpen, setIsOpen] = useState(false)
  const setAllOpen = (open: boolean) => {
    setIsOpen(open)
    setIsModalOpen(open)
  }

  const descriptionString =
    typeof description === 'string'
      ? description
      : richTextToString(description)

  return (
    <Col
      className={clsx(
        'break-words text-sm font-thin text-gray-100',
        'items-end'
      )}
    >
      <div className="line-clamp-3 w-full [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">
        {descriptionString}
      </div>

      <span
        className="mr-2 font-semibold text-indigo-400"
        onClick={() => setAllOpen(true)}
      >
        See more
      </span>

      {isOpen && (
        <MoreSwipeInfoDialog
          contract={contract}
          setOpen={setAllOpen}
          open={isOpen}
        />
      )}
    </Col>
  )
}

function MoreSwipeInfoDialog(props: {
  contract: BinaryContract
  setOpen: (open: boolean) => void
  open: boolean
}) {
  const { contract, setOpen, open } = props
  const { description } = contract

  const bets = useRecentBets(contract.id, 1000)
  const betPoints = (bets ?? []).map((bet) => ({
    x: bet.createdTime,
    y: bet.probAfter,
    obj: bet,
  }))
  const { viewScale } = useTimePicker(contract)

  const descriptionString =
    typeof description === 'string'
      ? description
      : richTextToString(description)

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      className={clsx(
        MODAL_CLASS,
        'pointer-events-auto max-h-[32rem] overflow-auto'
      )}
    >
      <Col>
        <SizedContainer fullHeight={250} mobileHeight={150}>
          {(w, h) => (
            <BinaryContractChart
              width={w}
              height={h}
              betPoints={betPoints}
              viewScaleProps={viewScale}
              controlledStart={
                betPoints.length > 0
                  ? Math.min(...betPoints.map((b) => b.x))
                  : contract.createdTime
              }
              contract={contract}
            />
          )}
        </SizedContainer>

        <Content content={descriptionString} />
        <Spacer h={4} />
        <Stats contract={contract} hideAdvanced />
        <Spacer h={4} />
        <UserBetsSummary contract={contract} />
      </Col>
    </Modal>
  )
}