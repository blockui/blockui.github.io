import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    render() {
      const {
        setState,
        estimateGame,
        player_nums_one_game,
        player_cost,
        use_player_cost,
        is_transfer_player,
        select_game_level,
        select_contract_days,
        estimateResult,
        playerContracts,
        max_se_one_player,
        games,
        disableChangePlayerNumber
      } = this.props
      return (
        <Fragment>
          <Stack
            height={12} paddingLeft={10} spacing={1}
            direction='row' justifyContent="flex-start"
            align='center'>
            {
              !disableChangePlayerNumber &&
              <Fragment>
                <InputGroup size={"sm"}>
                  <InputLeftAddon children='人数'/>
                  <Input onChange={(e) => {
                    const player_nums_one_game = e.target.value
                    setState({
                      player_nums_one_game: player_nums_one_game.length === 0 ? 1 : parseFloat(player_nums_one_game)
                    }, () => {
                      estimateGame()
                    })
                  }} readOnly={disableChangePlayerNumber} value={player_nums_one_game}/>
                </InputGroup>

                <InputGroup size={"sm"}>
                  <InputLeftAddon children='单场最大SE'/>
                  <Input onChange={(e) => {
                    let max_se_one_player = e.target.value
                    max_se_one_player = max_se_one_player.length === 0 ? 0 : parseFloat(max_se_one_player)
                    setState({
                      max_se_one_player
                    }, () => {
                      estimateGame()
                    })
                  }} readOnly={disableChangePlayerNumber} value={max_se_one_player}/>
                </InputGroup>
              </Fragment>
            }


            <InputGroup size={"sm"}>
              <InputLeftAddon children='选手成本(U)'/>
              <Input onChange={(e) => {
                const player_cost = e.target.value
                setState({
                  player_cost: player_cost.length === 0 ? 0 : parseFloat(player_cost)
                }, () => {
                  estimateGame()
                })
              }} readOnly={disableChangePlayerNumber} value={player_cost}/>
            </InputGroup>
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='player_cost_calc' mb='0'>
                计入选手成本
              </FormLabel>
              <Switch onChange={(e) => {
                setState({
                  use_player_cost: e.target.checked
                }, () => {
                  estimateGame()
                })
              }} isChecked={use_player_cost} id='player_cost_calc'/>
            </FormControl>
            <FormControl display='flex' alignItems='center'>
              <FormLabel htmlFor='player_transfer' mb='0'>
                飞选手
              </FormLabel>
              <Switch isChecked={is_transfer_player} onChange={(e) => {
                setState({
                  is_transfer_player: e.target.checked
                }, () => {
                  estimateGame()
                })
              }} id='player_transfer'/>
            </FormControl>
          </Stack>
          <Stack
            height={14} paddingLeft={10} spacing={1}
            direction='row' justifyContent="flex-start"
            align='center'>

            <Select value={select_contract_days || ""} onChange={(e) => {
              setState({
                select_contract_days: e.target.value === "" ? null : parseInt(e.target.value)
              }, () => {
                estimateGame()
              })
            }} size={"sm"} placeholder='全部合约'>
              {
                playerContracts.map(({duration, priceInUSD}) => {
                  return (
                    <option key={duration} value={duration}>{duration}天 {priceInUSD}u</option>
                  )
                })
              }
            </Select>
            <Select value={select_game_level || ""} onChange={(e) => {
              setState({
                select_game_level: e.target.value === "" ? null : parseInt(e.target.value)
              }, () => {
                estimateGame()
              })
            }} size={"sm"} placeholder='全部游戏'>
              {
                games.map(({level, chanceToWin, minSeAmount, rewardTokens}) => {
                  return (
                    <option key={level} value={level}>{level}级
                      SE:{minSeAmount} 胜率:{chanceToWin} 奖励:{(rewardTokens.bnb.usd + rewardTokens.bsw.usd).toFixed(2)} U </option>
                  )
                })
              }
            </Select>
          </Stack>
          {
            estimateResult.length > 0 &&
            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th>游戏SE</Th>
                  <Th>合约</Th>
                  <Th>获利率</Th>
                  <Th>45天获利率</Th>
                  <Th>总成本</Th>
                  <Th>合约成本</Th>
                  <Th>选手成本</Th>
                  <Th>选手数</Th>
                  <Th>游戏次数</Th>
                  <Th>回本</Th>
                  <Th>游戏总奖励</Th>
                  <Th>游戏单次奖励</Th>
                  <Th>游戏交易GAS费</Th>
                  <Th>飞选手GAS费</Th>
                  <Th>胜率</Th>
                  <Th>获利</Th>
                  <Th>平均每个选手se</Th>
                </Tr>
              </Thead>
              <Tbody>
                {
                  estimateResult.sort((a, b) => {
                    return b.profitability - a.profitability
                  }).map((row, i) => {
                    return (
                      <Tr key={i}>
                        <Td>
                          {row.game.level} / {row.game.minSeAmount}
                        </Td>
                        <Td>
                          {row.days}
                        </Td>
                        <Td>
                          {(row.profitability * 100).toFixed(1)} %
                        </Td>

                        <Td>
                          {(row.profitability_45 * 100).toFixed(1)} %
                        </Td>
                        <Td>
                          {row.final_cost.toFixed(2)}
                        </Td>
                        <Td>
                          {row.player_contract_cost}
                        </Td>
                        <Td>
                          {row.player_cost}
                        </Td>
                        <Td>
                          {row.player_nums_one_game}
                        </Td>
                        <Td>
                          {row.play_times}
                        </Td>
                        <Td>
                          {row.back_cost_play_time} 次 / {row.back_cost_days} 天后
                        </Td>
                        <Td>
                          {row.final_total_reward_usd.toFixed(2)}
                        </Td>
                        <Td>
                          {row.play_game_once_reward_usd.toFixed(2)}
                        </Td>
                        <Td>
                          {row.final_play_time_fee}
                        </Td>

                        <Td>
                          {row.final_transfer_player_fee}
                        </Td>
                        <Td>
                          {row.game.chanceToWin}
                        </Td>
                        <Td>
                          {row.profit.toFixed(1)}
                        </Td>
                        <Td>
                          {parseInt(row.game.minSeAmount / row.player_nums_one_game)}
                        </Td>
                      </Tr>
                    )
                  })
                }
              </Tbody>
            </Table>
          }

        </Fragment>
      )
    }
  }
)
