import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import "./style.scss"
import {WeFormGroup} from "shared/weui";
import {ModelBswGame} from "./shared/model_bsw_game";
import EstimateResult from "./components/EstimateResult";
import {Button, Stack} from "@chakra-ui/react";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        player_nums_one_game: 8,
        is_transfer_player: false,
        use_player_cost: false,
        select_contract_days: null,
        select_game_level: null,
        max_se_one_player: 800,
        player_cost: 0,

        transfer_one_player_once_game_fee: 0.2,
        play_game_once_fee: 0.5,

        games: [],
        playerContracts: [],
        estimateResult: []
      }
    }

    componentDidMount() {
      setTimeout(() => {
        this.estimateGame()
      }, 800)
    }

    onChangeVal(key, {target}) {
      debugger
      this.setState({
        [key]: target.value
      })
    }

    render() {
      const {
        estimateResult,
        use_player_cost,
        player_nums_one_game,
        player_cost,
        max_se_one_player,
        is_transfer_player,
        select_game_level,
        select_contract_days,
        games,
        playerContracts,
      } = this.state;

      return (
        <BasePage useScroll={true} back header={{
          title: "Estimate",
        }}>
          <div className="pt_8">
            <Stack
              height={12} paddingLeft={10} spacing={4}
              direction='row' justifyContent="flex-start"
              align='center'>
              <Button
                variant='solid'
                colorScheme='teal'
                size='sm'
                onClick={() => {
                  this.estimateGame()
                }}>
                测算
              </Button>
            </Stack>
            <WeFormGroup>
              <EstimateResult estimateResult={estimateResult} {...{
                setState: this.setState.bind(this),
                estimateGame: this.estimateGame.bind(this),
                use_player_cost,
                max_se_one_player,
                player_nums_one_game,
                player_cost,
                is_transfer_player,
                select_game_level,
                select_contract_days,
                games,
                playerContracts,
              }}/>
            </WeFormGroup>
          </div>
        </BasePage>
      )
    }

    estimateGame() {
      ModelBswGame.getGameInfo().then(({playerContracts, games}) => {
        const {
          is_transfer_player,
          select_game_level,
          use_player_cost,
          select_contract_days,
          max_se_one_player,
          player_nums_one_game,
          player_cost
        } = this.state;
        this.setState({
          playerContracts, games
        })

        const player_cost_ = use_player_cost ? player_cost : 0
        const game_levels = select_game_level !== null ? [select_game_level] : [1, 2, 3, 4, 5, 6, 7]
        const contract_days_list = select_contract_days !== null ? [select_contract_days] : [15, 30, 60]

        const player_nums_one_game_list = [player_nums_one_game]

        const estimateResult = ModelBswGame.estimateProfit({
          games, playerContracts,
          is_transfer_player,
          player_cost: player_cost_,
          max_se_one_player,
          game_levels,
          contract_days_list,
          player_nums_one_game_list
        })
        console.log(estimateResult)
        this.setState({
          player_nums_one_game,
          estimateResult,
          player_cost,
          max_se_one_player,
          is_transfer_player,
          select_game_level,
          select_contract_days,
        })
      })
    }
  }
)
