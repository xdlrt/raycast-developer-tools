import { ActionPanel, Action, List } from "@raycast/api";
import { useState } from "react";
import tinycolor from 'tinycolor2';

// 将 8 位 16 进制色值转换为 6 位 16 进制色值，通过将透明度混合到白色背景
function hex8ToHex6WithTransparency(hex8: string): string {
  if (hex8.length !== 9) return hex8; // 如果不是8位16进制色值，直接返回原值

  const r = parseInt(hex8.substring(1, 3), 16);
  const g = parseInt(hex8.substring(3, 5), 16);
  const b = parseInt(hex8.substring(5, 7), 16);
  const a = parseInt(hex8.substring(7, 9), 16) / 255;

  // 将透明度混合到白色背景
  const mix = (color: number) => Math.round(color * a + (1 - a) * 255);

  return `#${((1 << 24) + (mix(r) << 16) + (mix(g) << 8) + mix(b)).toString(16).slice(1)}`;
}

function colorToRgba(color: string) {
  const { r, g, b, a } = tinycolor(color).toRgb();
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const transformColor = (color: string) => {
  if (!color) return [];
  const hex6 = hex8ToHex6WithTransparency(tinycolor(color).toHex8String());
  const rgb = tinycolor(hex6).toRgbString();
  const rgba = (colorToRgba(color));
  return [
    hex6,
    rgb,
    rgba,
  ];
}


export default function Command() {
  const [color, setColor] = useState("");

  const colors = transformColor(color);

  return (
    <List
      onSearchTextChange={setColor}
      searchBarPlaceholder="input your color..."
      throttle
    >
      <List.Section title="Results">
        {colors.length > 0 && colors.map((color) => (<SearchListItem key={color} color={color} />))}
      </List.Section>
    </List>
  );
}

function SearchListItem({ color }: { color: string }) {
  return (
    <List.Item
      title={color}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.CopyToClipboard
              title="Copy"
              content={color}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
