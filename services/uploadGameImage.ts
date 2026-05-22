import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/supabase";

const BUCKET_NAME = "games-images";

export async function pickAndUploadGameImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
        throw new Error("Potrebna je dozvola za pristup galeriji.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
    });

    if (result.canceled) {
        return null;
    }

    const asset = result.assets[0];
    const fileExt = asset.uri.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `games/${fileName}`;

    const response = await fetch(asset.uri);
    const arrayBuffer = await response.arrayBuffer();

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, arrayBuffer, {
            contentType: asset.mimeType ?? "image/jpeg",
            upsert: false,
        });

    if (error) {
        throw error;
    }

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

    return data.publicUrl;
}