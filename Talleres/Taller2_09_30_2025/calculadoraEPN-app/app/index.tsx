import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { Colors } from "../constants/theme";
import * as Haptics from "expo-haptics";
 
export default function CalculatorScreen() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  
  const handlePress = async (value:string) => {
    const numberButtons = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const operaButtons = ["+", "-", "x", "÷"];
    const actionButtons = ["C", "del", "+/-"]

    //Vibraciones 
    if (numberButtons.includes(value)){
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (operaButtons.includes(value)){
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (actionButtons.includes(value)){
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    }

    if (value === "C") {
      setInput("");
      setResult("");
    } else if (value === "del") {
      setInput(input.slice(0, -1));
    } else if (value === "=") {
      try {
        const expression = input.replace("x", "*").replace("÷", "/");
        const evalResult = eval(expression);
        if (!isFinite(evalResult)) {
          setResult("Error");
          setInput("");
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        } else {
          setResult(evalResult.toString());
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        }
      } catch {
        setResult("Error");
        setInput("");
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      }
    } else if (value === "+/-") {
      if (input) {
        const tokens = input.split(/([+\-x÷])/);
        const lastToken = tokens[tokens.length - 1];
        if (!isNaN(Number(lastToken))) {
          tokens[tokens.length - 1] =
            Number(lastToken) * -1 >= 0
              ? String(Number(lastToken) * -1)
              : `(${Number(lastToken) * -1})`;
          setInput(tokens.join(""));
        }
      }
    } else {
      setInput(input + value);
    }
  };

  const buttons = [
    ["C", "+/-", "del", "÷"],
    ["7", "8", "9", "x"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.inputText}>{input || "0"}</Text>
        <Text style={styles.resultText}>{result}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn) => (
              <Pressable
                key={btn}
                style={[
                  styles.button,
                  btn === "0" && styles.buttonZero,
                  ["=", "÷", "x", "-", "+"].includes(btn)
                    ? styles.buttonOrange
                    : btn === "C" || btn === "+/-" || btn === "del"
                    ? styles.buttonGray
                    : styles.buttonDark,
                ]}
                onPress={() => handlePress(btn)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    ["C", "+/-", "del"].includes(btn)
                      ? styles.textBlack
                      : styles.textWhite,
                  ]}
                >
                  {btn}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// Tamaño adaptable
const { width } = Dimensions.get("window");
const buttonSize = width * 0.20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "flex-end",
    padding: 10,
  },
  display: {
    alignItems: "flex-end",
    marginBottom: 20,
    paddingRight: 10,
  },
  inputText: {
    fontSize: 48,
    color: Colors.textLight,
  },
  resultText: {
    fontSize: 32,
    color: "#A0A0A0",
  },
  buttonsContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDark: {
    backgroundColor: Colors.buttonDark,
  },
  buttonGray: {
    backgroundColor: Colors.buttonLight,
  },
  buttonOrange: {
    backgroundColor: Colors.buttonOrange,
  },
  buttonZero: {
    width: buttonSize * 2.3,
    alignItems: "flex-start",
    paddingLeft: 28,
  },
  buttonText: {
    fontSize: 32,
  },
  textWhite: {
    color: Colors.textLight,
  },
  textBlack: {
    color: Colors.textDark,
  },
});
