<template>
	<v-layout wrap v-if="$Auth.user">
		<v-flex xs12>
			<v-card>
				<v-card-title class="headline">
					Authentication
				</v-card-title>
				<v-divider/>
				<v-card-text>
					<v-layout wrap>
						<v-flex xs12 sm4>
							<v-subheader>Password</v-subheader>
						</v-flex>
						<v-flex xs12 sm8>
							<v-dialog v-model="passwordDialog">
								<v-btn flat color="primary" slot="activator">Change Password</v-btn>
								<v-form v-model="password.valid" @submit="changePassword">
									<v-card>
										<v-card-title class="headline">
											Change Password
										</v-card-title>
										<v-card-text>
											<v-text-field v-model="password.currentPassword" label="Current Password" type="password"></v-text-field>
											<v-text-field v-model="password.newPassword" label="New Password" type="password"></v-text-field>
											<v-text-field v-model="password.repeatPassword" :rules="password.repeatPassRule" label="Repeat new Password" type="password"></v-text-field>
										</v-card-text>
										<v-card-actions>
											<v-btn flat @click.stop="changePassword()">Change password</v-btn>
											<v-btn flat @click.stop="passwordDialog = false">Cancel</v-btn>
										</v-card-actions>
									</v-card>
								</v-form>
							</v-dialog>
						</v-flex>
					</v-layout>
				</v-card-text>
				<v-divider/>
				<v-card-text>
					<v-layout wrap>
						<v-flex xs12 sm4>
							<v-subheader>Logged in devices</v-subheader>
						</v-flex>
						<v-flex xs12 sm8>
							<v-list>
								<v-list-tile v-for="(token, i) in $Auth.user.tokens" :key="i">
									<v-list-tile-content>
										{{token.deviceName}}
									</v-list-tile-content>
									<v-list-tile-avatar @click="confirmRemoveToken(token)" v-if="token.token != $Auth.token">
										<v-icon>delete</v-icon>
									</v-list-tile-avatar>
									<v-list-tile-avatar v-else>
										<v-chip color="green darken-3" text-color="white">Current</v-chip>
									</v-list-tile-avatar>
								</v-list-tile>
							</v-list>
						</v-flex>
					</v-layout>
					<app-confirm-dialog v-model="removeTokenDialog" :yes-param="toRemoveToken" @yes="removeToken">
						<span v-if="toRemoveToken">Are you sure you want to remove "{{toRemoveToken.deviceName}}"?</span>
					</app-confirm-dialog>
				</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		data(){
			return {
				passwordDialog: false,	
				password:{
					valid: false,
					currentPassword: "",
					newPassword: "",
					repeatPassword: "",
					repeatPassRule: [
						(v) => {
							return v == this.password.newPassword || "Passwords don't match";
						}
					]
				},
				removeTokenDialog:false,
				toRemoveToken:null
			}
		},
		methods:{
			async changePassword(){
				try{
					await this.$Auth.changePassword(this.password.currentPassword, this.password.newPassword);
					this.passwordDialog = false;
				}catch(err){
					this.$emit("error", err);
				}
			},
			async removeToken(token){
				try{
					await this.$Auth.removeToken(token.token);
				}catch(err){
					this.$emit("error", err)
				}
			},
			confirmRemoveToken(token){
				this.toRemoveToken = token;
				this.removeTokenDialog = true;
			}
		}
	}
</script>
