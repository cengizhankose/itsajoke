import React, { useRef, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Platform,
  Dimensions,
  Modal,
} from "react-native";
import * as Haptics from "expo-haptics";
import { getHarshJoke } from "./openai.util";

const BLOB_COLORS = ["#FFD700", "#FFA500", "#FFB300", "#FF9800", "#FFC107"];
const BLOB_COUNT = 12;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function App() {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = React.useState(false);
  const [blow, setBlow] = React.useState(false);
  const [blobs, setBlobs] = React.useState<any[]>([]);
  const flashAnim = React.useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [joke, setJoke] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Prepare blobs
  useEffect(() => {
    if (blow) {
      const newBlobs = Array.from({ length: BLOB_COUNT }).map((_, i) => {
        // Random angle and distance for more spread
        const angle = getRandom(0, 2 * Math.PI);
        const distance = getRandom(SCREEN_HEIGHT * 0.3, SCREEN_HEIGHT * 0.6);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return {
          key: i,
          color: BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)],
          anim: new Animated.Value(0),
          x,
          y,
        };
      });
      setBlobs(newBlobs);
      // Animate blobs
      newBlobs.forEach((blob, i) => {
        Animated.timing(blob.anim, {
          toValue: 1,
          duration: 700,
          delay: i * 15,
          useNativeDriver: true,
        }).start();
      });
      // Animate flash
      flashAnim.setValue(1);
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
      // Hide effect after animation
      setTimeout(() => {
        setBlow(false);
        setModalVisible(true);
      }, 1000);
    }
  }, [blow]);

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scale, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };
  const handlePressOut = async () => {
    setPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
    setBlow(true);
    setLoading(true);
    setError(null);
    setJoke(null);
    try {
      const jokeText = await getHarshJoke();
      setJoke(jokeText);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch joke");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.outerCircle}>
        <Animated.View
          style={{
            transform: [{ scale }],
            width: 200,
            height: 200,
            borderRadius: 100,
            overflow: "hidden",
          }}
        >
          <Pressable
            style={({ pressed: isPressed }) => [
              styles.bigRedButton,
              isPressed || pressed ? styles.bigRedButtonPressed : null,
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>it's a joke</Text>
          </Pressable>
        </Animated.View>
      </View>
      {/* Overlay after button to ensure it's on top */}
      {blow && (
        <View
          style={[StyleSheet.absoluteFill, { zIndex: 10 }]}
          pointerEvents="none"
        >
          {/* Flash overlay */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: "#fff",
                opacity: flashAnim,
                zIndex: 11,
              },
            ]}
          />
          {/* Blobs */}
          {blobs.map((blob) => (
            <Animated.View
              key={blob.key}
              style={[
                styles.blob,
                {
                  backgroundColor: blob.color,
                  transform: [
                    { translateX: SCREEN_WIDTH / 2 - 40 },
                    { translateY: SCREEN_HEIGHT / 2 - 40 },
                    {
                      translateX: blob.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, blob.x],
                      }),
                    },
                    {
                      translateY: blob.anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, blob.y],
                      }),
                    },
                    {
                      scale: blob.anim.interpolate({
                        inputRange: [0, 0.7, 1],
                        outputRange: [0.2, 1.2, 0.7],
                      }),
                    },
                  ],
                  opacity: blob.anim.interpolate({
                    inputRange: [0, 0.7, 1],
                    outputRange: [0, 1, 0],
                  }),
                  zIndex: 12,
                },
              ]}
            />
          ))}
        </View>
      )}
      <StatusBar style="auto" />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {loading ? (
              <Text style={styles.modalText}>Loading...</Text>
            ) : error ? (
              <Text style={styles.modalText}>Error: {error}</Text>
            ) : (
              <Text style={styles.modalText}>
                {joke || "Boom! It's a joke 🎉"}
              </Text>
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  outerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#888",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 6,
    borderColor: "#444",
    marginBottom: 10,
  },
  bigRedButton: {
    backgroundColor: "red",
    borderRadius: 100,
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 4,
    borderColor: "#b20000",
    borderTopWidth: 6,
    borderTopColor: "#ff6666",
    borderBottomWidth: 8,
    borderBottomColor: "#800000",
  },
  bigRedButtonPressed: {
    backgroundColor: "#a30000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    borderTopColor: "#cc3333",
    borderBottomColor: "#660000",
  },
  buttonText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  blob: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#222",
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
