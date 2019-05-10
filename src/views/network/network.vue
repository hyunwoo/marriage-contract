<template>

  <v-container fluid=""
               style="height:calc(100vh - 80px);">

    <div class="command-group elevation-1">
      <a-tabs defaultActiveKey="2">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="apple" />
            Tab 1
          </span>
          <div class="tab-content pa-3">
            <a-slider range
                      @change="changeSelectedRange"
                      :min="ui.rangeSlider.min"
                      :max="ui.rangeSlider.max"
                      :defaultValue="ui.rangeSlider.values"
                      :values="ui.rangeSlider.values" />
            <a-select mode="multiple"
                      :defaultValue="ui.edge.defaultSelected"
                      style="width: 100%"
                      @change="changeSelectedEdgeType"
                      placeholder="Select Edge">
              <a-select-option v-for="edgeType in ui.edge.types"
                               style="background:#f0f"
                               :key="edgeType">{{edgeType}}
              </a-select-option>
            </a-select>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="android" />
            Tab 2
          </span>
          <div class="tab-content">
            <a-button type="primary">Primary</a-button>
            <v-btn @click="extractNodes">EXTRACT</v-btn>
          </div>
        </a-tab-pane>
      </a-tabs>

    </div>

    <v-layout fill-height=""
              ref="network"
              class="network">

    </v-layout>

  </v-container>
</template>
<script src="./network.ts">
</script>
<style lang='scss'>
@import './network.scss';
</style>
