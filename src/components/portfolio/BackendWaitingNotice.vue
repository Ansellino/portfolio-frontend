<script setup lang="ts">
withDefaults(
	defineProps<{
		description?: string;
	}>(),
	{
		description: 'Konten akan muncul otomatis saat koneksi berhasil.',
	}
);
</script>

<template>
	<div class="rounded-xl border border-dashed bg-card p-4 text-sm text-muted-foreground">
		<span class="font-medium text-foreground">Tunggu terkonek ke backend...</span>
		<span class="ml-2">{{ description }}</span>
	</div>
</template>
