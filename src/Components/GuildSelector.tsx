import React from "react";
import Grid from "./Grid";
import { GridRow } from "./GridRow";
import { getSVGPath } from "../Other/Utils";

type GuildSelectorProps = {
  title: string;
  pageWidth: number;
};

type GuildSelectorState = {
  index: number;
};

// Change these values only when changing them in main.scss (.guild:not(:first-child)), too!
const guildGap = 20;
const guildWidth = 182;
const pageWidthPercentage = 60;
const fadedGuildWidth = 60;

export default class GuildSelector extends React.Component<
  GuildSelectorProps,
  GuildSelectorState
> {
  constructor(props: GuildSelectorProps) {
    super(props);
    this.state = {
      index: 0,
    };
    this.showSlice = this.showSlice.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }

  calculateMaxGuildsOnScreen() {
    const pageWidth = () => (pageWidthPercentage / 100) * this.props.pageWidth;

    const offset = () => guildGap + guildWidth;

    const pageWidthWithoutFaders = () => pageWidth() / offset();

    const isSecondFaderVisible = () =>
      React.Children.count(this.props.children) - pageWidthWithoutFaders() !==
      this.state.index;

    const isFirst = () => this.state.index > 0;

    let fadedGuildFactor = 1;

    if (!isFirst() && isSecondFaderVisible()) {
      fadedGuildFactor = 2;
    }

    return Math.floor(
      (pageWidth() + (fadedGuildWidth + guildGap) * fadedGuildFactor) /
        offset() -
        1
    );
  }
  showSlice() {
    let children = this.props.children;
    return React.Children.map(children, (child, index: number) => {
      if (
        index >= this.state.index &&
        index - this.state.index < this.calculateMaxGuildsOnScreen()
      )
        return child;
      else return undefined;
    });
  }
  previous() {
    if (this.state.index - 1 < 0) return;
    this.setState({
      index: this.state.index - 1,
    });
  }
  next() {
    let newIndex = this.state.index;
    if (
      newIndex ===
      React.Children.count(this.props.children) -
        this.calculateMaxGuildsOnScreen()
    )
      return;
    this.setState({
      index: this.state.index + 1,
    });
  }
  render() {
    let hasNext =
      React.Children.count(this.props.children) -
        this.calculateMaxGuildsOnScreen() !==
      this.state.index;
    return (
      <Grid gap={8} className="guild-selector">
        <GridRow cell_override="1fr auto">
          <h3 className="selector-title">{this.props.title}</h3>
          <GridRow cells={2} gap={8}>
            <div
              className="selector-control"
              onClick={this.previous}
              style={{
                cursor: this.state.index === 0 ? "not-allowed" : undefined,
              }}
            >
              <img
                src={getSVGPath(
                  "previous" + (this.state.index === 0 ? "-disabled" : "")
                )}
                draggable={false}
              />
            </div>
            <div
              className="selector-control"
              draggable={false}
              onClick={this.next}
              style={{
                cursor: !hasNext ? "not-allowed" : undefined,
              }}
            >
              <img src={getSVGPath("next" + (!hasNext ? "-disabled" : ""))} />
            </div>
          </GridRow>
        </GridRow>
        <div
          className={"guilds" + (this.state.index > 0 ? " non-zero-index" : "")}
        >
          {this.state.index !== 0 && (
            <div className="faded-guild f1">
              <div />
            </div>
          )}
          {this.showSlice()}
          {hasNext && (
            <div className="faded-guild f2">
              <div />
            </div>
          )}
        </div>
      </Grid>
    );
  }
}
